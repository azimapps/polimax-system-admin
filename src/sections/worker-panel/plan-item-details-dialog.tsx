import type { PlanItem } from 'src/types/worker-panel';

import * as z from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetBrigadas } from 'src/hooks/use-brigadas';
import { useGetMyMaterials } from 'src/hooks/use-worker-panel';
import {
    useLogProduction,
    useLogMaterialUsage,
    useTransferPlanItem,
    useGetPlanItemTransfers,
    useGetProductionLogSummary,
    useGetPlanItemMaterialsSummary
} from 'src/hooks/use-material-usage';

import { useTranslate } from 'src/locales';

import { Form, Field } from 'src/components/hook-form';

type Props = {
    open: boolean;
    onClose: () => void;
    planItem: PlanItem | null;
};

const UsageSchema = z.object({
    ombor_transaction_id: z.number().min(1, "Tranzaksiyani tanlang"),
    used_amount: z.number().min(0.01, "Miqdor 0 dan katta bo'lishi kerak"),
    remainder_destination: z.enum(['machine_warehouse', 'main_warehouse']),
    percentage: z.number().min(0).max(100).optional(),
    notes: z.string().optional(),
});

const TransferSchema = z.object({
    to_brigada_id: z.number().min(1, 'Brigadani tanlang'),
    notes: z.string().optional(),
});

const ProductionSchema = z.object({
    meters_produced: z.number().min(0, "Manfiy bo'lishi mumkin emas"),
    kg_produced: z.number().min(0, "Manfiy bo'lishi mumkin emas"),
    work_type: z.string().optional(),
    percentage: z.number().min(0).max(100).optional(),
    notes: z.string().optional(),
});

export function PlanItemDetailsDialog({ open, onClose, planItem }: Props) {
    const { t } = useTranslate('stanok');

    const [activeTab, setActiveTab] = useState<'materials' | 'usage' | 'production' | 'transfer'>('materials');

    const { data: summary, isLoading: isLoadingSummary } = useGetPlanItemMaterialsSummary(planItem?.id || 0, {
        enabled: !!planItem && open && activeTab === 'materials'
    });

    const { data: materialsData, isLoading: isLoadingMaterials } = useGetMyMaterials({
        transaction_type: 'kirim'
    });
    // Filter materials belonging to this plan item to show in dropdown
    const planItemTransactions = materialsData?.filter(m => m.plan_item_id === planItem?.id) || [];

    const { data: transfers, isLoading: isLoadingTransfers } = useGetPlanItemTransfers(planItem?.id || 0, {
        enabled: !!planItem && open && activeTab === 'transfer'
    });

    const { data: brigadas = [] } = useGetBrigadas();

    const { data: productionSummary, isLoading: isLoadingProduction } = useGetProductionLogSummary(planItem?.id || 0);

    const logUsageMutation = useLogMaterialUsage();
    const transferMutation = useTransferPlanItem(planItem?.id || 0);
    const logProductionMutation = useLogProduction();

    const usageMethods = useForm<z.infer<typeof UsageSchema>>({
        resolver: zodResolver(UsageSchema),
        defaultValues: {
            ombor_transaction_id: 0,
            used_amount: 0,
            remainder_destination: 'machine_warehouse',
            notes: '',
        }
    });

    const transferMethods = useForm<z.infer<typeof TransferSchema>>({
        resolver: zodResolver(TransferSchema),
        defaultValues: {
            to_brigada_id: 0,
            notes: '',
        }
    });

    const productionMethods = useForm<z.infer<typeof ProductionSchema>>({
        resolver: zodResolver(ProductionSchema),
        defaultValues: {
            meters_produced: 0,
            kg_produced: 0,
            work_type: '',
            percentage: undefined,
            notes: '',
        }
    });

    const onSubmitUsage = async (data: z.infer<typeof UsageSchema>) => {
        if (!planItem) return;
        try {
            await logUsageMutation.mutateAsync({
                ...data,
                plan_item_id: planItem.id
            });
            toast.success("Material sarfi saqlandi!");
            usageMethods.reset();
            setActiveTab('materials');
        } catch (error: any) {
            toast.error(error?.response?.data?.detail || error.message || 'Xatolik');
        }
    };

    const onSubmitTransfer = async (data: z.infer<typeof TransferSchema>) => {
        if (!planItem) return;
        try {
            await transferMutation.mutateAsync(data);
            toast.success("Vazifa boshqa brigadaga o'tkazildi!");
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.detail || error.message || 'Xatolik');
        }
    };

    const onSubmitProduction = async (data: z.infer<typeof ProductionSchema>) => {
        if (!planItem) return;
        try {
            await logProductionMutation.mutateAsync({
                ...data,
                plan_item_id: planItem.id
            });
            toast.success("Ishlab chiqarish hajmi kiritildi!");
            productionMethods.reset();
        } catch (error: any) {
            toast.error(error?.response?.data?.detail || error.message || 'Xatolik');
        }
    };

    const handleClose = () => {
        usageMethods.reset();
        transferMethods.reset();
        productionMethods.reset();
        setActiveTab('materials');
        onClose();
    };

    if (!planItem) return null;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Vazifa Tafsilotlari: ORD-{planItem.order_id}</DialogTitle>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, display: 'flex', gap: 2 }}>
                <Button
                    color={activeTab === 'materials' ? 'primary' : 'inherit'}
                    onClick={() => setActiveTab('materials')}
                    sx={{ pb: 1, borderRadius: 0, borderBottom: activeTab === 'materials' ? 2 : 0 }}
                >
                    Materiallar Holati
                </Button>
                <Button
                    color={activeTab === 'usage' ? 'primary' : 'inherit'}
                    onClick={() => setActiveTab('usage')}
                    sx={{ pb: 1, borderRadius: 0, borderBottom: activeTab === 'usage' ? 2 : 0 }}
                >
                    Material Sarfi Kiritish
                </Button>
                <Button
                    color={activeTab === 'production' ? 'primary' : 'inherit'}
                    onClick={() => setActiveTab('production')}
                    sx={{ pb: 1, borderRadius: 0, borderBottom: activeTab === 'production' ? 2 : 0 }}
                >
                    Ishlab chiqarish hajmi
                </Button>
                <Button
                    color={activeTab === 'transfer' ? 'warning' : 'inherit'}
                    onClick={() => setActiveTab('transfer')}
                    sx={{ pb: 1, borderRadius: 0, borderBottom: activeTab === 'transfer' ? 2 : 0 }}
                >
                    Boshqa Brigadaga O&apos;tkazish
                </Button>
            </Box>

            <DialogContent sx={{ py: 3 }}>
                {activeTab === 'materials' && (
                    <Stack spacing={3}>
                        {isLoadingSummary ? (
                            <Box display="flex" justifyContent="center" py={3}><CircularProgress /></Box>
                        ) : (
                            <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: 'background.neutral' }}>
                                        <TableRow>
                                            <TableCell>Material</TableCell>
                                            <TableCell align="right">Olingan (Kirim)</TableCell>
                                            <TableCell align="right">Ishlatilgan</TableCell>
                                            <TableCell align="right">Qoldiq</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {summary?.materials.length === 0 ? (
                                            <TableRow><TableCell colSpan={4} align="center">Ma&apos;lumot topilmadi</TableCell></TableRow>
                                        ) : summary?.materials.map((mat) => (
                                            <TableRow key={mat.ombor_item_id}>
                                                <TableCell>{mat.ombor_item_name}</TableCell>
                                                <TableCell align="right">{mat.total_received}</TableCell>
                                                <TableCell align="right" sx={{ color: 'error.main' }}>{mat.total_used}</TableCell>
                                                <TableCell align="right" sx={{ color: mat.remaining > 0 ? 'success.main' : 'text.secondary', fontWeight: 'bold' }}>
                                                    {mat.remaining}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Stack>
                )}

                {activeTab === 'usage' && (
                    <Form methods={usageMethods} onSubmit={usageMethods.handleSubmit(onSubmitUsage)}>
                        <Stack spacing={3}>
                            <Field.Select name="ombor_transaction_id" label="Qaysi materialdan (Kirim)">
                                <MenuItem value={0} disabled>Tanlang</MenuItem>
                                {planItemTransactions.map((tr) => (
                                    <MenuItem key={tr.id} value={tr.id}>
                                        {tr.notes || 'Nomsiz'} (Mavjud: {tr.quantity_kg || tr.quantity_liter || tr.quantity_count} {tr.quantity_kg ? 'kg' : tr.quantity_liter ? 'L' : 'dona'} - Sana: {new Date(tr.date).toLocaleDateString()})
                                    </MenuItem>
                                ))}
                            </Field.Select>

                            <Field.Text name="used_amount" label="Ishlatilgan Miqdor" type="number" />

                            <Field.Select name="remainder_destination" label="Qoldiq Qayerda Qoladi?">
                                <MenuItem value="machine_warehouse">Stanokda qoladi (Kuting)</MenuItem>
                                <MenuItem value="main_warehouse">Asosiy omborga qaytariladi</MenuItem>
                            </Field.Select>

                            <Field.Text name="percentage" label="Foizi (%) (Ixtiyoriy)" type="number" />
                            <Field.Text name="notes" label="Izoh (Ixtiyoriy)" multiline rows={3} />

                            <Box display="flex" justifyContent="flex-end">
                                <Button type="submit" variant="contained" disabled={logUsageMutation.isPending}>
                                    {logUsageMutation.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
                                </Button>
                            </Box>
                        </Stack>
                    </Form>
                )}

                {activeTab === 'production' && (
                    <Form methods={productionMethods} onSubmit={productionMethods.handleSubmit(onSubmitProduction)}>
                        <Stack spacing={3}>
                            <Alert severity="info">
                                Bu xizmat orqali siz smena davomida qancha mahsulot ishlab chiqarganingizni kiritasiz. Tizim brigadadagi har bir ishchi uchun avtomatik yozuv yaratadi.
                            </Alert>

                            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                                <Field.Text name="meters_produced" label="Metr (m)" type="number" />
                                <Field.Text name="kg_produced" label="Og'irligi (kg)" type="number" />
                            </Box>

                            <Field.Select name="work_type" label="Ish turini tanlang (Ixtiyoriy)">
                                <MenuItem value="">Tanlang</MenuItem>
                                <MenuItem value="tayyor_mahsulotlar_reskasi">Tayyor mahsulotlar reskasi</MenuItem>
                                <MenuItem value="tayyor_mahsulot_peremotkasi">Tayyor mahsulot peremotkasi</MenuItem>
                                <MenuItem value="plyonka_peremotkasi">Plyonka peremotkasi</MenuItem>
                                <MenuItem value="reska_3_5_sm">Reska 3-5 sm</MenuItem>
                                <MenuItem value="asobiy_tarif">Asobiy tarif</MenuItem>
                            </Field.Select>

                            <Field.Text name="percentage" label="Foizi (%) (Ixtiyoriy)" type="number" />
                            <Field.Text name="notes" label="Smena / Izoh" />

                            <Box display="flex" justifyContent="flex-end">
                                <Button type="submit" variant="contained" disabled={logProductionMutation.isPending}>
                                    {logProductionMutation.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
                                </Button>
                            </Box>

                            <Divider />
                            <Typography variant="subtitle2">Kiritilgan hajmlar tarixi</Typography>
                            {isLoadingProduction ? (
                                <CircularProgress size={24} />
                            ) : (
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Ishchi</TableCell>
                                            <TableCell>Metr</TableCell>
                                            <TableCell>Kg</TableCell>
                                            <TableCell>Foiz/Ish turi</TableCell>
                                            <TableCell>Qachon</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {productionSummary?.entries?.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell>{log.worker_fullname}</TableCell>
                                                <TableCell>{log.meters_produced} m</TableCell>
                                                <TableCell>{log.kg_produced} kg</TableCell>
                                                <TableCell>
                                                    {log.percentage ? `${log.percentage}% ` : ''}
                                                    {log.work_type ? `(${log.work_type})` : ''}
                                                </TableCell>
                                                <TableCell>{new Date(log.created_at).toLocaleString('uz-UZ')}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </Stack>
                    </Form>
                )}

                {activeTab === 'transfer' && (
                    <Form methods={transferMethods} onSubmit={transferMethods.handleSubmit(onSubmitTransfer)}>
                        <Stack spacing={3}>
                            <Alert severity="warning">
                                Diqqat! Vazifani boshqa brigadaga o&apos;tkazganingizda, stanokdagi barcha qoldiq materiallar ham avtomatik ravishda yangi brigadaga o&apos;tkaziladi.
                            </Alert>

                            <Field.Select name="to_brigada_id" label="Yangi Brigada">
                                <MenuItem value={0} disabled>Tanlang</MenuItem>
                                {brigadas.filter(b => b.id !== planItem.brigada_id).map((b) => (
                                    <MenuItem key={b.id} value={b.id}>{b.name} ({b.machine_type})</MenuItem>
                                ))}
                            </Field.Select>

                            <Field.Text name="notes" label="Izoh (Ixtiyoriy)" multiline rows={3} />

                            <Box display="flex" justifyContent="flex-end">
                                <Button type="submit" color="warning" variant="contained" disabled={transferMutation.isPending}>
                                    {transferMutation.isPending ? "O'tkazilmoqda..." : "O'tkazish"}
                                </Button>
                            </Box>

                            <Divider />
                            <Typography variant="subtitle2">O&apos;tkazmalar tarixi</Typography>
                            {isLoadingTransfers ? (
                                <CircularProgress size={24} />
                            ) : (
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Qachon</TableCell>
                                            <TableCell>Qayerdan</TableCell>
                                            <TableCell>Qayerga</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {transfers?.map(tr => (
                                            <TableRow key={tr.id}>
                                                <TableCell>{new Date(tr.created_at).toLocaleString('uz-UZ')}</TableCell>
                                                <TableCell>Brigada {tr.from_brigada_id} (Stanok {tr.from_machine_id})</TableCell>
                                                <TableCell>Brigada {tr.to_brigada_id} (Stanok {tr.to_machine_id})</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </Stack>
                    </Form>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Yopish</Button>
            </DialogActions>
        </Dialog>
    );
}
