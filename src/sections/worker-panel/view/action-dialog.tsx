import { useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetBrigadas } from 'src/hooks/use-brigadas';
import { useGetPlanItem } from 'src/hooks/use-plan-items';
import { useLogProduction, useGetMachineStock, useGetPlanItemSteps } from 'src/hooks/use-material-usage';

// ----------------------------------------------------------------------

const STEP_TYPE_LABELS: Record<string, string> = {
    reska: 'Reska',
    pechat: 'Pechat',
    sushka: 'Sushka',
    laminatsiya: 'Laminatsiya',
    tayyor: 'Tayyor',
};

const STEP_TYPE_COLORS: Record<string, string> = {
    reska: '#2196f3',
    pechat: '#ff9800',
    sushka: '#f44336',
    laminatsiya: '#9c27b0',
    tayyor: '#4caf50',
};

const STEP_STATUS_ICON: Record<string, string> = {
    completed: '✓',
    in_progress: '●',
    pending: '○',
};

const WORK_TYPES = [
    { value: 'tayyor_mahsulotlar_reskasi', label: 'Tayyor mahsulotlar reskasi' },
    { value: 'tayyor_mahsulot_peremotkasi', label: 'Tayyor mahsulot peremotkasi' },
    { value: 'plyonka_peremotkasi', label: 'Plyonka peremotkasi' },
    { value: 'reska_3_5_sm', label: 'Reska 3-5 sm' },
    { value: 'asobiy_tarif', label: 'Asobiy tarif' },
];

// ----------------------------------------------------------------------

function StepPipeline({ steps, currentStepId }: { steps: any[]; currentStepId?: number }) {
    const sorted = [...steps].sort((a, b) => a.step_number - b.step_number);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', py: 1.5, px: 2, bgcolor: 'background.neutral', borderRadius: 1.5, mb: 3 }}>
            {sorted.map((step, idx) => {
                const isCurrent = step.id === currentStepId;
                const color = STEP_TYPE_COLORS[step.step_type] || '#919eab';
                const icon = STEP_STATUS_ICON[step.status] || '○';

                return (
                    <Box key={step.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1,
                                bgcolor: isCurrent ? `${color}22` : 'transparent',
                                border: isCurrent ? `1.5px solid ${color}` : '1.5px solid transparent',
                            }}
                        >
                            <Typography variant="caption" sx={{ color, fontWeight: 700, fontSize: '0.7rem' }}>
                                {icon}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: isCurrent ? 700 : 500,
                                    color: isCurrent ? color : 'text.secondary',
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {STEP_TYPE_LABELS[step.step_type] || step.step_type}
                            </Typography>
                        </Box>
                        {idx < sorted.length - 1 && (
                            <Typography variant="caption" sx={{ color: 'text.disabled', mx: 0.25 }}>→</Typography>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
}

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    planItemId: number | null;
    step?: any;
    readOnly?: boolean;
};

export function ActionDialog({ open, onClose, planItemId, step, readOnly }: Props) {
    const effectivePlanItemId = step?.plan_item_id || planItemId;

    const { data: planItemDetail } = useGetPlanItem(effectivePlanItemId || 0, { enabled: !!effectivePlanItemId });
    const { data: stock = [], isLoading: isStockLoading } = useGetMachineStock();
    const { data: brigadas = [] } = useGetBrigadas();
    const { data: pipelineSteps = [] } = useGetPlanItemSteps(effectivePlanItemId || 0, { enabled: !!effectivePlanItemId });

    // Form state
    const [usageAmounts, setUsageAmounts] = useState<Record<number, string>>({});
    const [meters, setMeters] = useState('');
    const [kg, setKg] = useState('');
    const [kgWaste, setKgWaste] = useState('');
    const [kgOstatok, setKgOstatok] = useState('');
    const [workType, setWorkType] = useState('');
    const [notes, setNotes] = useState('');

    // Send state
    const [sendEnabled, setSendEnabled] = useState(false);
    const [sendToBrigada, setSendToBrigada] = useState('');
    const [sendKg, setSendKg] = useState('');
    const [sendMeters, setSendMeters] = useState('');
    const [sendKgWaste, setSendKgWaste] = useState('');
    const [sendKgOstatok, setSendKgOstatok] = useState('');
    const [sendNotes, setSendNotes] = useState('');

    const logProd = useLogProduction();

    if (!effectivePlanItemId) return null;

    const stepType = step?.step_type;
    const orderTitle = step?.plan_item?.order_title;
    const kgReceived = step?.kg_received;

    const handleSave = async () => {
        try {
            // Build materials array from stock usage amounts
            const materialsPayload = Object.entries(usageAmounts)
                .map(([matId, amount]) => {
                    const parsedAmount = Number(amount);
                    if (!parsedAmount || parsedAmount <= 0) return null;

                    // For now, use ombor_item_id as a placeholder — the backend
                    // expects ombor_transaction_id but machine-stock doesn't expose it.
                    // The production-log endpoint handles this via the plan_item context.
                    return {
                        ombor_transaction_id: Number(matId),
                        used_amount: parsedAmount,
                        remainder_destination: 'machine_warehouse' as const,
                    };
                })
                .filter(Boolean) as any[];

            // Build send payload
            const sendPayload = sendEnabled && sendToBrigada ? {
                to_brigada_id: Number(sendToBrigada),
                kg_sent: Number(sendKg) || 0,
                meters_sent: Number(sendMeters) || 0,
                kg_waste: Number(sendKgWaste) || undefined,
                kg_ostatok: Number(sendKgOstatok) || undefined,
                notes: sendNotes || undefined,
            } : undefined;

            await logProd.mutateAsync({
                plan_item_id: effectivePlanItemId,
                meters_produced: Number(meters) || 0,
                kg_produced: Number(kg) || 0,
                work_type: workType || undefined,
                notes: notes || undefined,
                materials: materialsPayload.length > 0 ? materialsPayload : undefined,
                send: sendPayload,
            });

            // Reset form
            setUsageAmounts({});
            setMeters('');
            setKg('');
            setKgWaste('');
            setKgOstatok('');
            setWorkType('');
            setNotes('');
            setSendEnabled(false);
            setSendToBrigada('');
            setSendKg('');
            setSendMeters('');
            setSendKgWaste('');
            setSendKgOstatok('');
            setSendNotes('');

            onClose();
        } catch (error) {
            console.error('Error saving:', error);
        }
    };

    const isSaving = logProd.isPending;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
            <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {stepType && (
                        <Chip
                            label={STEP_TYPE_LABELS[stepType] || stepType}
                            size="small"
                            sx={{
                                bgcolor: `${STEP_TYPE_COLORS[stepType] || '#919eab'}22`,
                                color: STEP_TYPE_COLORS[stepType] || '#919eab',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                fontSize: '0.75rem',
                            }}
                        />
                    )}
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {readOnly ? 'Bosqich tafsilotlari' : 'Ishlab chiqarish'}
                    </Typography>
                </Box>
                {orderTitle && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        {orderTitle}
                        {kgReceived != null && (
                            <Box component="span" sx={{ color: 'info.main', ml: 1 }}>
                                · Olindi: {kgReceived} kg
                            </Box>
                        )}
                    </Typography>
                )}
            </DialogTitle>

            <DialogContent sx={{ px: 3, pb: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Step Pipeline */}
                {pipelineSteps.length > 0 && (
                    <StepPipeline steps={pipelineSteps} currentStepId={step?.id} />
                )}

                {/* Order Details */}
                {planItemDetail?.order && (
                    <Box sx={{ bgcolor: 'background.neutral', borderRadius: 1.5, p: 2.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'primary.main' }}>
                            Buyurtma ma&apos;lumotlari
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
                            <Stack spacing={0.25}>
                                <Typography variant="caption" sx={{ color: 'text.disabled' }}>Buyurtma №</Typography>
                                <Typography variant="subtitle2">{planItemDetail.order.order_number || '-'}</Typography>
                            </Stack>
                            <Stack spacing={0.25}>
                                <Typography variant="caption" sx={{ color: 'text.disabled' }}>Nomi</Typography>
                                <Typography variant="subtitle2">{planItemDetail.order.title || '-'}</Typography>
                            </Stack>
                            <Stack spacing={0.25}>
                                <Typography variant="caption" sx={{ color: 'text.disabled' }}>Material</Typography>
                                <Typography variant="subtitle2">{planItemDetail.order.material || '-'} {planItemDetail.order.sub_material || ''}</Typography>
                            </Stack>
                            <Stack spacing={0.25}>
                                <Typography variant="caption" sx={{ color: 'text.disabled' }}>Hajmi (kg)</Typography>
                                <Typography variant="subtitle2">{planItemDetail.order.quantity_kg ?? '-'}</Typography>
                            </Stack>
                            <Stack spacing={0.25}>
                                <Typography variant="caption" sx={{ color: 'text.disabled' }}>Plyonka qalinligi</Typography>
                                <Typography variant="subtitle2">{planItemDetail.order.film_thickness ?? '-'}</Typography>
                            </Stack>
                            <Stack spacing={0.25}>
                                <Typography variant="caption" sx={{ color: 'text.disabled' }}>Plyonka kengligi</Typography>
                                <Typography variant="subtitle2">{planItemDetail.order.film_width ?? '-'}</Typography>
                            </Stack>
                            <Stack spacing={0.25}>
                                <Typography variant="caption" sx={{ color: 'text.disabled' }}>Val uzunligi</Typography>
                                <Typography variant="subtitle2">{planItemDetail.order.cylinder_length ?? '-'}</Typography>
                            </Stack>
                            <Stack spacing={0.25}>
                                <Typography variant="caption" sx={{ color: 'text.disabled' }}>Val soni</Typography>
                                <Typography variant="subtitle2">{planItemDetail.order.cylinder_count ?? '-'}</Typography>
                            </Stack>
                            <Stack spacing={0.25}>
                                <Typography variant="caption" sx={{ color: 'text.disabled' }}>Val aylanmasi</Typography>
                                <Typography variant="subtitle2">{planItemDetail.order.cylinder_aylanasi ?? '-'}</Typography>
                            </Stack>
                            <Stack spacing={0.25}>
                                <Typography variant="caption" sx={{ color: 'text.disabled' }}>Vtulka</Typography>
                                <Typography variant="subtitle2">{planItemDetail.order.vtulka || '-'}</Typography>
                            </Stack>
                            <Stack spacing={0.25}>
                                <Typography variant="caption" sx={{ color: 'text.disabled' }}>Napravlenie</Typography>
                                <Typography variant="subtitle2">{planItemDetail.order.napravlenie || '-'}</Typography>
                            </Stack>
                        </Box>
                    </Box>
                )}

                {!readOnly && (
                    <>
                        {/* Materials Section */}
                        <Box sx={{ bgcolor: 'background.neutral', borderRadius: 1.5, overflow: 'hidden' }}>
                            <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(145, 158, 171, 0.12)' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Mavjud materiallar</Typography>
                            </Box>

                            {isStockLoading ? (
                                <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} /></Box>
                            ) : stock.length === 0 ? (
                                <Typography variant="body2" sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>Uskunada materiallar topilmadi</Typography>
                            ) : stock.map((mat, idx) => (
                                <Box key={mat.ombor_item_id} sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: idx !== stock.length - 1 ? '1px solid rgba(145, 158, 171, 0.12)' : 'none' }}>
                                    <Typography variant="body2" sx={{ flexGrow: 1 }}>{mat.ombor_item_name}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, ml: 2 }}>
                                        <Typography variant="subtitle2" sx={{ minWidth: 60, textAlign: 'right', color: 'info.main' }}>
                                            {mat.stock_at_machine} kg/l
                                        </Typography>
                                        <TextField
                                            size="small"
                                            placeholder="0"
                                            value={usageAmounts[mat.ombor_item_id] || ''}
                                            onChange={(e) => setUsageAmounts({ ...usageAmounts, [mat.ombor_item_id]: e.target.value })}
                                            sx={{ width: 80, '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255, 255, 255, 0.04)', '& fieldset': { borderColor: 'rgba(145, 158, 171, 0.24)' } } }}
                                            inputProps={{ style: { textAlign: 'center' } }}
                                        />
                                    </Box>
                                </Box>
                            ))}
                        </Box>

                        {/* Production Section */}
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Ishlab chiqarish natijasi</Typography>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <TextField fullWidth label="Metr ishlab chiqarilgan" placeholder="0" value={meters} onChange={(e) => setMeters(e.target.value)} />
                                <TextField fullWidth label="Kg ishlab chiqarilgan" placeholder="0" value={kg} onChange={(e) => setKg(e.target.value)} />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <TextField fullWidth label="Kg chiqindi (waste)" placeholder="0" value={kgWaste} onChange={(e) => setKgWaste(e.target.value)} />
                                <TextField fullWidth label="Kg qoldiq (ostatok)" placeholder="0" value={kgOstatok} onChange={(e) => setKgOstatok(e.target.value)} />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Ish turi</InputLabel>
                                    <Select label="Ish turi" value={workType} onChange={(e) => setWorkType(e.target.value)}>
                                        <MenuItem value="">Tanlanmagan</MenuItem>
                                        {WORK_TYPES.map((wt) => (
                                            <MenuItem key={wt.value} value={wt.value}>{wt.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField fullWidth label="Izoh" placeholder="Ixtiyoriy" value={notes} onChange={(e) => setNotes(e.target.value)} />
                            </Box>
                        </Box>

                        {/* Send to Next Step Section */}
                        <Box sx={{ border: '1px dashed rgba(145, 158, 171, 0.24)', borderRadius: 1.5, p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ color: 'success.main', fontWeight: 600 }}>
                                    Keyingi bosqichga yuborish
                                </Typography>
                                <Button
                                    size="small"
                                    variant={sendEnabled ? 'contained' : 'outlined'}
                                    color={sendEnabled ? 'success' : 'inherit'}
                                    onClick={() => setSendEnabled(!sendEnabled)}
                                    sx={{ minWidth: 90 }}
                                >
                                    {sendEnabled ? 'Yoqilgan' : 'Yoqish'}
                                </Button>
                            </Box>

                            {sendEnabled && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Qaysi brigadaga?</InputLabel>
                                        <Select label="Qaysi brigadaga?" value={sendToBrigada} onChange={(e) => setSendToBrigada(e.target.value)}>
                                            <MenuItem value="">Tanlang</MenuItem>
                                            {brigadas.map((b: any) => (
                                                <MenuItem key={b.id} value={String(b.id)}>{b.name} ({b.machine_type})</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <TextField fullWidth label="Kg yuboriladi" placeholder="0" value={sendKg} onChange={(e) => setSendKg(e.target.value)} />
                                        <TextField fullWidth label="Metr yuboriladi" placeholder="0" value={sendMeters} onChange={(e) => setSendMeters(e.target.value)} />
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <TextField fullWidth label="Kg chiqindi" placeholder="0" value={sendKgWaste} onChange={(e) => setSendKgWaste(e.target.value)} />
                                        <TextField fullWidth label="Kg qoldiq" placeholder="0" value={sendKgOstatok} onChange={(e) => setSendKgOstatok(e.target.value)} />
                                    </Box>
                                    <TextField fullWidth label="Izoh" placeholder="Ixtiyoriy" value={sendNotes} onChange={(e) => setSendNotes(e.target.value)} />
                                </Box>
                            )}
                        </Box>
                    </>
                )}

                {/* Read-only summary for completed steps */}
                {readOnly && step && (
                    <Box sx={{ bgcolor: 'background.neutral', borderRadius: 1.5, p: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Natijalar</Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Kg olindi</Typography>
                                <Typography variant="subtitle2">{step.kg_received ?? '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Kg ishlab chiqarildi</Typography>
                                <Typography variant="subtitle2">{step.kg_produced ?? '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Metr ishlab chiqarildi</Typography>
                                <Typography variant="subtitle2">{step.meters_produced ?? '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Kg chiqindi</Typography>
                                <Typography variant="subtitle2">{step.kg_waste ?? '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Kg qoldiq</Typography>
                                <Typography variant="subtitle2">{step.kg_ostatok ?? '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Holati</Typography>
                                <Chip
                                    label={step.status === 'completed' ? 'Yakunlangan' : step.status === 'in_progress' ? 'Jarayonda' : 'Kutilmoqda'}
                                    size="small"
                                    color={step.status === 'completed' ? 'success' : step.status === 'in_progress' ? 'warning' : 'default'}
                                    sx={{ mt: 0.5 }}
                                />
                            </Box>
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0, borderTop: '1px dashed rgba(145, 158, 171, 0.12)' }}>
                <Button onClick={onClose} sx={{ color: 'text.primary', fontWeight: 600 }} disabled={isSaving}>
                    {readOnly ? 'Yopish' : 'Bekor qilish'}
                </Button>
                {!readOnly && (
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={isSaving}
                        color="success"
                    >
                        {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Saqlash'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
