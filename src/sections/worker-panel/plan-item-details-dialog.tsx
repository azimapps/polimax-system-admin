import type { PlanItem } from 'src/types/worker-panel';

import * as z from 'zod';
import { toast } from 'sonner';
import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useGetBrigadas } from 'src/hooks/use-brigadas';
import { useUpdatePlanItem } from 'src/hooks/use-plan-items';
import { useGetMyMaterials } from 'src/hooks/use-worker-panel';
import {
    useLogProduction,
    useLogMaterialUsage,
    useTransferPlanItem,
    useGetPlanItemMaterialsSummary
} from 'src/hooks/use-material-usage';

import { Form, Field } from 'src/components/hook-form';

import { PlanItemStatus } from 'src/types/plan-item';

type Props = {
    open: boolean;
    onClose: () => void;
    planItem: PlanItem | null;
};

const StatusSchema = z.object({
    materials: z.record(z.string(), z.number().min(0)),
    meters_produced: z.number().min(0).optional(),
    kg_produced: z.number().min(0).optional(),
    destination_type: z.string().optional(),
    to_brigada_id: z.number().optional(),
}).refine(data => {
    if (data.destination_type && data.destination_type !== 'angren_sklad' && (!data.to_brigada_id || data.to_brigada_id === 0)) {
        return false;
    }
    return true;
}, {
    message: "Stanokni tanlang",
    path: ["to_brigada_id"]
});

export function PlanItemDetailsDialog({ open, onClose, planItem }: Props) {
    const { data: summary } = useGetPlanItemMaterialsSummary(planItem?.id || 0, {
        enabled: !!planItem && open
    });

    const { data: materialsData } = useGetMyMaterials({
        transaction_type: 'kirim'
    });

    // Group transactions by item ID to safely find the transaction ID later
    const planItemTransactions = useMemo(() => materialsData?.filter(m => m.plan_item_id === planItem?.id) || [], [materialsData, planItem?.id]);

    const { data: brigadas = [] } = useGetBrigadas();

    const logUsageMutation = useLogMaterialUsage();
    const transferMutation = useTransferPlanItem(planItem?.id || 0);
    const logProductionMutation = useLogProduction();
    const updatePlanItemMutation = useUpdatePlanItem(planItem?.id || 0);

    const methods = useForm<z.infer<typeof StatusSchema>>({
        resolver: zodResolver(StatusSchema),
        defaultValues: {
            materials: {},
            meters_produced: 0,
            kg_produced: 0,
            destination_type: '',
            to_brigada_id: 0,
        }
    });

    const { handleSubmit, watch, reset, setValue, control } = methods;
    const destinationType = watch('destination_type');

    const isSubmitting = logUsageMutation.isPending || transferMutation.isPending || logProductionMutation.isPending || updatePlanItemMutation.isPending;

    const onSubmit = async (data: z.infer<typeof StatusSchema>) => {
        if (!planItem) return;

        try {
            // 1. Log Material Usages
            const materialPromises = Object.entries(data.materials).map(async ([itemIdStr, amount]) => {
                if (amount > 0) {
                    const itemId = Number(itemIdStr);
                    // Find matching transaction
                    const tx = planItemTransactions.find(t => t.ombor_item_id === itemId);

                    if (tx) {
                        return logUsageMutation.mutateAsync({
                            ombor_transaction_id: tx.id,
                            plan_item_id: planItem.id,
                            used_amount: amount,
                            remainder_destination: 'machine_warehouse', // default
                        });
                    }
                }
                return Promise.resolve();
            });
            await Promise.all(materialPromises);

            // 2. Log Production
            if ((data.meters_produced && data.meters_produced > 0) || (data.kg_produced && data.kg_produced > 0)) {
                await logProductionMutation.mutateAsync({
                    plan_item_id: planItem.id,
                    meters_produced: data.meters_produced || 0,
                    kg_produced: data.kg_produced || 0,
                });
            }

            // 3. Handle Dispatch
            if (data.destination_type) {
                if (data.destination_type === 'angren_sklad') {
                    await updatePlanItemMutation.mutateAsync({ status: PlanItemStatus.FINISHED });
                } else if (data.to_brigada_id) {
                    await transferMutation.mutateAsync({
                        to_brigada_id: data.to_brigada_id,
                    });
                }
            }

            toast.success("Status yangilandi!");
            handleClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.detail || error.message || 'Xatolik yuz berdi');
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleTakeAll = () => {
        if (summary?.materials) {
            const newMaterialsMap: Record<string, number> = {};
            summary.materials.forEach(mat => {
                if (mat.remaining > 0) {
                    newMaterialsMap[mat.ombor_item_id.toString()] = mat.remaining;
                }
            });
            setValue('materials', newMaterialsMap, { shouldValidate: true });
        }
    };

    if (!planItem) return null;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: 'background.default', borderRadius: 2 } }}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Statusni yangilash</Typography>

                <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={4}>

                        {/* EXISTING MATERIALS BOX */}
                        <Card sx={{ p: 3, bgcolor: '#1C252E', border: '1px solid', borderColor: 'divider' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="subtitle2">Mavjud materiallar</Typography>
                                <Button size="small" variant="outlined" color="inherit" onClick={handleTakeAll}>
                                    Hammasini olish
                                </Button>
                            </Box>

                            <Stack spacing={2}>
                                {summary?.materials.map((mat) => {
                                    const unit = mat.ombor_item_type === 'rastvaritel' ? 'L' : 'kg';
                                    return (
                                        <Box key={mat.ombor_item_id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                            <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1, minWidth: 200 }}>
                                                {mat.ombor_item_name}
                                            </Typography>

                                            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                                <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 600 }}>
                                                    {mat.price_per_unit} {mat.price_currency === 'usd' ? 'USD' : mat.price_currency === 'eur' ? 'EUR' : 'UZS'} / {unit}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600, width: 60, textAlign: 'right' }}>
                                                    {mat.remaining} {unit}
                                                </Typography>

                                                <Controller
                                                    name={`materials.${mat.ombor_item_id}`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            size="small"
                                                            type="number"
                                                            placeholder="0"
                                                            value={field.value || ''}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                            InputProps={{
                                                                endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
                                                                sx: { width: 120, bgcolor: 'background.neutral' }
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </Box>
                                        </Box>
                                    );
                                })}
                                {(!summary?.materials || summary.materials.length === 0) && (
                                    <Typography variant="body2" color="text.secondary">Mavjud materiallar yo&apos;q</Typography>
                                )}
                            </Stack>
                        </Card>

                        {/* PRODUCTION ADDITIONS BOX */}
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Jami ishlab chiqarilgan (Ushbu smena/partiya)</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                                Kiritilgan miqdor umumiy soniga qo&apos;shiladi (+).
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Field.Text
                                    name="meters_produced"
                                    label="Metr (Qo'shish +)"
                                    type="number"
                                    sx={{ flex: 1 }}
                                    InputProps={{
                                        sx: { bgcolor: 'background.neutral' }
                                    }}
                                />
                                <Field.Text
                                    name="kg_produced"
                                    label="Kg (Qo'shish +)"
                                    type="number"
                                    sx={{ flex: 1 }}
                                    InputProps={{
                                        sx: { bgcolor: 'background.neutral' }
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* DISPATCH BOX */}
                        <Card sx={{ p: 3, bgcolor: '#1C252E', border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="subtitle2" sx={{ color: 'success.main', mb: 2 }}>Yuborish (Dispatch)</Typography>

                            <Stack spacing={3}>
                                <Field.Select
                                    name="destination_type"
                                    label="Qayerga yuborish?"
                                    sx={{ bgcolor: 'background.neutral' }}
                                >
                                    <MenuItem value="" disabled>Tanlang...</MenuItem>
                                    <MenuItem value="reska">Reska</MenuItem>
                                    <MenuItem value="laminatsiya">Laminatsiya</MenuItem>
                                    <MenuItem value="sushka">Quritish (Sushka)</MenuItem>
                                    <MenuItem value="angren_sklad">Angren Sklad (Tayyor Mahsulotlar)</MenuItem>
                                </Field.Select>

                                {destinationType && destinationType !== 'angren_sklad' && (
                                    <Field.Select
                                        name="to_brigada_id"
                                        label="Stanok tanlang"
                                        sx={{ bgcolor: 'background.neutral' }}
                                    >
                                        <MenuItem value={0} disabled>Tanlang...</MenuItem>
                                        {brigadas.filter(b => b.id !== planItem.brigada_id && b.machine_type === destinationType).map((b) => (
                                            <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                                        ))}
                                    </Field.Select>
                                )}
                            </Stack>
                        </Card>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                            <Button variant="outlined" color="inherit" onClick={handleClose}>
                                Bekor qilish
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
                            </Button>
                        </Box>

                    </Stack>
                </Form>
            </Box>
        </Dialog>
    );
}

