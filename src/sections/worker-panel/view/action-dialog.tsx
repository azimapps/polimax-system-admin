import { useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
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

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
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
                                bgcolor: isCurrent ? `${color}15` : 'transparent',
                                border: isCurrent ? `2px solid ${color}` : '2px solid transparent',
                            }}
                        >
                            <Typography variant="caption" sx={{ color, fontWeight: 700, fontSize: '0.7rem' }}>
                                {icon}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: isCurrent ? 700 : 500,
                                    color: step.status === 'pending' ? '#94a3b8' : color,
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                }}
                            >
                                {STEP_TYPE_LABELS[step.step_type] || step.step_type}
                            </Typography>
                        </Box>
                        {idx < sorted.length - 1 && (
                            <Iconify icon="eva:arrow-ios-forward-fill" width={14} sx={{ color: '#cbd5e1' }} />
                        )}
                    </Box>
                );
            })}
        </Box>
    );
}

function InfoItem({ label, value }: { label: string; value: any }) {
    return (
        <Stack spacing={0.25}>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {label}
            </Typography>
            <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 500 }}>
                {value || '-'}
            </Typography>
        </Stack>
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
    const [sendToBrigada, setSendToBrigada] = useState('');
    const [sendKg, setSendKg] = useState('');
    const [sendMeters, setSendMeters] = useState('');
    const [sendKgWaste, setSendKgWaste] = useState('');
    const [sendKgOstatok, setSendKgOstatok] = useState('');
    const [sendNotes, setSendNotes] = useState('');

    const logProd = useLogProduction();

    if (!effectivePlanItemId) return null;

    const stepType = step?.step_type;
    const stepColor = STEP_TYPE_COLORS[stepType] || '#64748b';
    const order = planItemDetail?.order;
    const orderTitle = order?.title || step?.plan_item?.order_title;
    const kgReceived = step?.kg_received;

    // Find next step (skip sushka — it auto-passes, no brigada needed)
    const sortedSteps = [...pipelineSteps].sort((a: any, b: any) => a.step_number - b.step_number);
    const currentIdx = sortedSteps.findIndex((s: any) => s.id === step?.id);
    let nextStep: any = null;
    for (let i = currentIdx + 1; i < sortedSteps.length; i += 1) {
        if (sortedSteps[i].step_type !== 'sushka') {
            nextStep = sortedSteps[i];
            break;
        }
    }
    const nextStepType = nextStep?.step_type;
    const nextStepColor = STEP_TYPE_COLORS[nextStepType] || '#64748b';
    const nextStepLabel = STEP_TYPE_LABELS[nextStepType] || nextStepType;
    // Filter brigadas to only those matching the next step's type
    const filteredBrigadas = nextStepType
        ? brigadas.filter((b: any) => b.machine_type === nextStepType)
        : brigadas;

    const handleSave = async () => {
        try {
            const materialsPayload = Object.entries(usageAmounts)
                .map(([matId, amount]) => {
                    const parsedAmount = Number(amount);
                    if (!parsedAmount || parsedAmount <= 0) return null;
                    return {
                        ombor_transaction_id: Number(matId),
                        used_amount: parsedAmount,
                        remainder_destination: 'machine_warehouse' as const,
                    };
                })
                .filter(Boolean) as any[];

            const sendPayload = sendToBrigada ? {
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

            setUsageAmounts({});
            setMeters('');
            setKg('');
            setKgWaste('');
            setKgOstatok('');
            setWorkType('');
            setNotes('');
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
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: '#fff',
                    backgroundImage: 'none',
                    borderRadius: 3,
                    overflow: 'hidden',
                },
            }}
        >
            {/* Header */}
            <DialogTitle sx={{ p: 0 }}>
                <Box sx={{ bgcolor: `${stepColor}08`, borderBottom: `2px solid ${stepColor}20`, px: 3, py: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            {stepType && (
                                <Box sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '10px',
                                    bgcolor: stepColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                }}>
                                    {(STEP_TYPE_LABELS[stepType] || stepType).charAt(0)}
                                </Box>
                            )}
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                                    {readOnly ? 'Bosqich tafsilotlari' : 'Ishlab chiqarish'}
                                </Typography>
                                {stepType && (
                                    <Typography variant="caption" sx={{ color: stepColor, fontWeight: 600, textTransform: 'uppercase' }}>
                                        {STEP_TYPE_LABELS[stepType] || stepType}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        <IconButton onClick={onClose} sx={{ color: '#94a3b8' }}>
                            <Iconify icon="mingcute:close-line" />
                        </IconButton>
                    </Box>
                    {(orderTitle || kgReceived != null) && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                            {orderTitle && (
                                <Chip label={orderTitle} size="small" sx={{ bgcolor: '#fff', color: '#475569', fontWeight: 500, fontSize: '0.75rem', border: '1px solid #e2e8f0' }} />
                            )}
                            {order?.order_number && (
                                <Chip label={order.order_number} size="small" sx={{ bgcolor: '#fff', color: stepColor, fontWeight: 600, fontSize: '0.75rem', border: `1px solid ${stepColor}40` }} />
                            )}
                            {kgReceived != null && (
                                <Chip
                                    label={`Olindi: ${kgReceived} kg`}
                                    size="small"
                                    sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 600, fontSize: '0.75rem', border: '1px solid #a7f3d0' }}
                                />
                            )}
                        </Box>
                    )}
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                <Scrollbar sx={{ maxHeight: '65vh' }}>
                    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

                        {/* Step Pipeline */}
                        {pipelineSteps.length > 0 && (
                            <Box sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, p: 2 }}>
                                <StepPipeline steps={pipelineSteps} currentStepId={step?.id} />
                            </Box>
                        )}

                        {/* Order Details */}
                        {order && (
                            <Box sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, p: 2.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Iconify icon="solar:file-text-bold" width={18} sx={{ color: '#64748b' }} />
                                    Buyurtma ma&apos;lumotlari
                                </Typography>
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                                    <InfoItem label="Buyurtma №" value={order.order_number} />
                                    <InfoItem label="Nomi" value={order.title} />
                                    <InfoItem label="Material" value={`${order.material || '-'} ${order.sub_material || ''}`} />
                                    <InfoItem label="Hajmi" value={order.quantity_kg ? `${order.quantity_kg} kg` : null} />
                                    <InfoItem label="Plyonka qalinligi" value={order.film_thickness} />
                                    <InfoItem label="Plyonka kengligi" value={order.film_width} />
                                    <InfoItem label="Val uzunligi" value={order.cylinder_length} />
                                    <InfoItem label="Val soni" value={order.cylinder_count} />
                                    <InfoItem label="Val aylanmasi" value={order.cylinder_aylanasi} />
                                    <InfoItem label="Vtulka" value={order.vtulka} />
                                    <InfoItem label="Napravlenie" value={order.napravlenie} />
                                </Box>
                            </Box>
                        )}

                        {!readOnly && (
                            <>
                                <Divider sx={{ borderStyle: 'dashed', borderColor: '#e2e8f0' }} />

                                {/* Materials Section */}
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Iconify icon="solar:inbox-bold" width={18} sx={{ color: '#64748b' }} />
                                        Mavjud materiallar
                                    </Typography>
                                    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                                        {isStockLoading ? (
                                            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} /></Box>
                                        ) : stock.length === 0 ? (
                                            <Typography variant="body2" sx={{ p: 3, textAlign: 'center', color: '#94a3b8' }}>
                                                Uskunada materiallar topilmadi
                                            </Typography>
                                        ) : stock.map((mat, idx) => (
                                            <Box
                                                key={mat.ombor_item_id}
                                                sx={{
                                                    px: 2.5,
                                                    py: 1.5,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    borderBottom: idx !== stock.length - 1 ? '1px solid #f1f5f9' : 'none',
                                                    '&:hover': { bgcolor: '#f8fafc' },
                                                    transition: 'background 0.15s',
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500 }}>
                                                    {mat.ombor_item_name}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Chip
                                                        label={`${mat.stock_at_machine} kg/l`}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: mat.stock_at_machine > 0 ? '#ecfdf5' : '#fef2f2',
                                                            color: mat.stock_at_machine > 0 ? '#059669' : '#dc2626',
                                                            fontWeight: 600,
                                                            fontSize: '0.75rem',
                                                            border: `1px solid ${mat.stock_at_machine > 0 ? '#a7f3d0' : '#fecaca'}`,
                                                        }}
                                                    />
                                                    <TextField
                                                        size="small"
                                                        placeholder="0"
                                                        value={usageAmounts[mat.ombor_item_id] || ''}
                                                        onChange={(e) => setUsageAmounts({ ...usageAmounts, [mat.ombor_item_id]: e.target.value })}
                                                        sx={{
                                                            width: 80,
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#fff',
                                                                '& fieldset': { borderColor: '#e2e8f0' },
                                                                '&:hover fieldset': { borderColor: '#94a3b8' },
                                                                '&.Mui-focused fieldset': { borderColor: stepColor },
                                                            },
                                                            '& input': { textAlign: 'center', color: '#1e293b', fontWeight: 600 },
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>

                                <Divider sx={{ borderStyle: 'dashed', borderColor: '#e2e8f0' }} />

                                {/* Production Section */}
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Iconify icon="solar:list-bold" width={18} sx={{ color: '#64748b' }} />
                                        Ishlab chiqarish natijasi
                                    </Typography>
                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <TextField fullWidth size="small" label="Metr ishlab chiqarilgan" placeholder="0" value={meters} onChange={(e) => setMeters(e.target.value)} />
                                            <TextField fullWidth size="small" label="Kg ishlab chiqarilgan" placeholder="0" value={kg} onChange={(e) => setKg(e.target.value)} />
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <TextField fullWidth size="small" label="Kg chiqindi (waste)" placeholder="0" value={kgWaste} onChange={(e) => setKgWaste(e.target.value)} />
                                            <TextField fullWidth size="small" label="Kg qoldiq (ostatok)" placeholder="0" value={kgOstatok} onChange={(e) => setKgOstatok(e.target.value)} />
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Ish turi</InputLabel>
                                                <Select label="Ish turi" value={workType} onChange={(e) => setWorkType(e.target.value)}>
                                                    <MenuItem value="">Tanlanmagan</MenuItem>
                                                    {WORK_TYPES.map((wt) => (
                                                        <MenuItem key={wt.value} value={wt.value}>{wt.label}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <TextField fullWidth size="small" label="Izoh" placeholder="Ixtiyoriy" value={notes} onChange={(e) => setNotes(e.target.value)} />
                                        </Box>
                                    </Stack>
                                </Box>

                                {/* Send to Next Step Section */}
                                <Box sx={{
                                    border: '2px solid #22c55e',
                                    borderRadius: 2,
                                    p: 2.5,
                                    bgcolor: '#f0fdf4',
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Iconify icon="solar:transfer-horizontal-bold-duotone" width={20} sx={{ color: '#16a34a' }} />
                                            <Typography variant="subtitle2" sx={{ color: '#16a34a', fontWeight: 600 }}>
                                                Keyingi bosqichga yuborish
                                            </Typography>
                                        </Box>
                                        {nextStepType && (
                                            <Chip
                                                label={nextStepLabel}
                                                size="small"
                                                sx={{
                                                    bgcolor: `${nextStepColor}15`,
                                                    color: nextStepColor,
                                                    fontWeight: 700,
                                                    fontSize: '0.75rem',
                                                    textTransform: 'uppercase',
                                                    border: `1.5px solid ${nextStepColor}40`,
                                                }}
                                            />
                                        )}
                                    </Box>

                                    <Stack spacing={2}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>{nextStepLabel ? `${nextStepLabel} brigadasi` : 'Qaysi brigadaga?'}</InputLabel>
                                            <Select
                                                label={nextStepLabel ? `${nextStepLabel} brigadasi` : 'Qaysi brigadaga?'}
                                                value={sendToBrigada}
                                                onChange={(e) => setSendToBrigada(e.target.value)}
                                            >
                                                <MenuItem value="">Tanlang</MenuItem>
                                                {filteredBrigadas.map((b: any) => (
                                                    <MenuItem key={b.id} value={String(b.id)}>{b.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <TextField fullWidth size="small" label="Kg yuboriladi" placeholder="0" value={sendKg} onChange={(e) => setSendKg(e.target.value)} />
                                            <TextField fullWidth size="small" label="Metr yuboriladi" placeholder="0" value={sendMeters} onChange={(e) => setSendMeters(e.target.value)} />
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <TextField fullWidth size="small" label="Kg chiqindi" placeholder="0" value={sendKgWaste} onChange={(e) => setSendKgWaste(e.target.value)} />
                                            <TextField fullWidth size="small" label="Kg qoldiq" placeholder="0" value={sendKgOstatok} onChange={(e) => setSendKgOstatok(e.target.value)} />
                                        </Box>
                                        <TextField fullWidth size="small" label="Izoh" placeholder="Ixtiyoriy" value={sendNotes} onChange={(e) => setSendNotes(e.target.value)} />
                                    </Stack>
                                </Box>
                            </>
                        )}

                        {/* Read-only summary */}
                        {readOnly && step && (
                            <Box sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, p: 2.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Iconify icon="solar:list-bold" width={18} sx={{ color: '#64748b' }} />
                                    Natijalar
                                </Typography>
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                                    <InfoItem label="Kg olindi" value={step.kg_received} />
                                    <InfoItem label="Kg ishlab chiqarildi" value={step.kg_produced} />
                                    <InfoItem label="Metr ishlab chiqarildi" value={step.meters_produced} />
                                    <InfoItem label="Kg chiqindi" value={step.kg_waste} />
                                    <InfoItem label="Kg qoldiq" value={step.kg_ostatok} />
                                    <Stack spacing={0.25}>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            Holati
                                        </Typography>
                                        <Chip
                                            label={step.status === 'completed' ? 'Yakunlangan' : step.status === 'in_progress' ? 'Jarayonda' : 'Kutilmoqda'}
                                            size="small"
                                            sx={{
                                                width: 'fit-content',
                                                fontWeight: 600,
                                                fontSize: '0.7rem',
                                                ...(step.status === 'completed' && { bgcolor: '#dcfce7', color: '#16a34a' }),
                                                ...(step.status === 'in_progress' && { bgcolor: '#fef3c7', color: '#d97706' }),
                                                ...(step.status === 'pending' && { bgcolor: '#f1f5f9', color: '#64748b' }),
                                            }}
                                        />
                                    </Stack>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Scrollbar>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e8f0', bgcolor: '#fafbfc' }}>
                <Button
                    onClick={onClose}
                    disabled={isSaving}
                    sx={{ color: '#64748b', fontWeight: 600, borderRadius: 1.5 }}
                >
                    {readOnly ? 'Yopish' : 'Bekor qilish'}
                </Button>
                {!readOnly && (
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={isSaving}
                        sx={{
                            bgcolor: stepColor,
                            borderRadius: 1.5,
                            fontWeight: 600,
                            px: 3,
                            '&:hover': { bgcolor: stepColor, filter: 'brightness(0.9)' },
                        }}
                    >
                        {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Saqlash'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
