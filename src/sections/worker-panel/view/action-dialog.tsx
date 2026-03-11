import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
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
import { useGetMyBrigada, useLogProduction, useGetMachineStock, useGetPlanItemSteps } from 'src/hooks/use-material-usage';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

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

const WORK_TYPE_KEYS = [
    'tayyor_mahsulotlar_reskasi',
    'tayyor_mahsulot_peremotkasi',
    'plyonka_peremotkasi',
    'reska_3_5_sm',
    'asobiy_tarif',
];

// ----------------------------------------------------------------------

function StepPipeline({ steps, currentStepId, t }: { steps: any[]; currentStepId?: number; t: any }) {
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
                                {t(`steps.${step.step_type}`) || step.step_type}
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

function SushkaCountdown({ endAt }: { endAt: string }) {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const end = new Date(endAt).getTime();
    const diff = end - now;

    if (diff <= 0) {
        return (
            <Chip
                icon={<Iconify icon="solar:check-circle-bold" width={16} />}
                label="Tayyor!"
                size="small"
                sx={{ bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 700, fontSize: '0.8rem' }}
            />
        );
    }

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    const timeStr = hours > 0
        ? `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
        : `${minutes}m ${String(seconds).padStart(2, '0')}s`;

    return (
        <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1,
            borderRadius: 2,
            bgcolor: '#fef3c7',
            border: '1px solid #fde68a',
        }}>
            <Iconify icon="solar:clock-circle-bold" width={18} sx={{ color: '#d97706' }} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#92400e', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                {timeStr}
            </Typography>
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
    const { t } = useTranslate('pechat-panel');
    const effectivePlanItemId = step?.plan_item_id || planItemId;

    const { data: planItemDetail } = useGetPlanItem(effectivePlanItemId || 0, { enabled: !!effectivePlanItemId });
    const { data: stock = [], isLoading: isStockLoading } = useGetMachineStock();
    const { data: brigadas = [] } = useGetBrigadas();
    const { data: myBrigadaData } = useGetMyBrigada();
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
    const [sushkaDurationHours, setSushkaDurationHours] = useState('');

    const logProd = useLogProduction();

    // Auto-preselect current brigada for sushka mode
    const myBrigadaId = myBrigadaData?.brigada?.id;
    useEffect(() => {
        if (step?.step_type === 'sushka' && myBrigadaId && !sendToBrigada) {
            setSendToBrigada(String(myBrigadaId));
        }
    }, [step?.step_type, myBrigadaId, sendToBrigada]);

    if (!effectivePlanItemId) return null;

    const stepType = step?.step_type;
    const stepColor = STEP_TYPE_COLORS[stepType] || '#64748b';
    const order = planItemDetail?.order;
    const orderTitle = order?.title || step?.plan_item?.order_title;
    const kgReceived = step?.kg_received;
    const isSushka = stepType === 'sushka';

    // Find next step in pipeline
    const sortedSteps = [...pipelineSteps].sort((a: any, b: any) => a.step_number - b.step_number);
    const currentIdx = sortedSteps.findIndex((s: any) => s.id === step?.id);
    const nextStep: any = currentIdx >= 0 && currentIdx < sortedSteps.length - 1
        ? sortedSteps[currentIdx + 1]
        : null;
    const nextStepType = nextStep?.step_type;
    const nextIsSushka = nextStepType === 'sushka';
    // When next step is sushka, find the step AFTER sushka for brigada filtering & labels
    const stepAfterSushka = nextIsSushka
        ? sortedSteps.find((s: any, i: number) => i > currentIdx + 1 && s.step_type !== 'sushka')
        : null;
    // Display labels: show the brigada's actual step (step after sushka when next is sushka)
    const brigadaStepType = nextIsSushka ? stepAfterSushka?.step_type : nextStepType;
    const brigadaStepColor = STEP_TYPE_COLORS[brigadaStepType] || '#64748b';
    const brigadaStepLabel = brigadaStepType ? t(`steps.${brigadaStepType}`) : '';
    // Filter brigadas by the actual target step type
    const filteredBrigadas = brigadaStepType
        ? brigadas.filter((b: any) => b.machine_type === brigadaStepType)
        : brigadas;

    const handleSave = async () => {
        try {
            if (isSushka) {
                // Sushka mode: kg_produced = kg_received, no waste, no materials
                const sushkaSend = sendToBrigada ? {
                    to_brigada_id: Number(sendToBrigada),
                    kg_sent: kgReceived || 0,
                    meters_sent: 0,
                    kg_waste: 0,
                    kg_ostatok: 0,
                } : undefined;

                await logProd.mutateAsync({
                    plan_item_id: effectivePlanItemId,
                    kg_produced: kgReceived || 0,
                    meters_produced: 0,
                    send: sushkaSend,
                });
            } else {
            const materialsPayload = Object.entries(usageAmounts)
                .map(([matId, amount]) => {
                    const parsedAmount = Number(amount);
                    if (!parsedAmount || parsedAmount <= 0) return null;
                    return {
                        ombor_item_id: Number(matId),
                        used_amount: parsedAmount,
                        remainder_destination: 'machine_warehouse' as const,
                    };
                })
                .filter(Boolean) as any[];

            const sendPayload = sendToBrigada ? {
                to_brigada_id: Number(sendToBrigada),
                kg_sent: Number(kg) || 0,
                meters_sent: Number(meters) || 0,
                kg_waste: Number(kgWaste) || undefined,
                kg_ostatok: Number(kgOstatok) || undefined,
                notes: notes || undefined,
                ...(nextIsSushka && sushkaDurationHours ? {
                    sushka_end_at: (() => {
                        const d = new Date(Date.now() + Number(sushkaDurationHours) * 3600000);
                        const pad = (n: number) => String(n).padStart(2, '0');
                        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
                    })(),
                } : {}),
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
            }

            setUsageAmounts({});
            setMeters('');
            setKg('');
            setKgWaste('');
            setKgOstatok('');
            setWorkType('');
            setNotes('');
            setSendToBrigada('');
            setSushkaDurationHours('');

            onClose();
        } catch (error) {
            console.error('Error saving:', error);
        }
    };

    const isSaving = logProd.isPending;
    const hasOverflow = stock.some((mat) => (Number(usageAmounts[mat.ombor_item_id]) || 0) > mat.stock_at_machine);
    const kgTotal = (Number(kg) || 0) + (Number(kgWaste) || 0) + (Number(kgOstatok) || 0);
    const hasTotalOverflow = kgReceived != null && kgReceived > 0 && kgTotal > kgReceived;

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
                                    {(t(`steps.${stepType}`) || stepType).charAt(0)}
                                </Box>
                            )}
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                                    {readOnly ? t('dialog.title_details') : t('dialog.title_production')}
                                </Typography>
                                {stepType && (
                                    <Typography variant="caption" sx={{ color: stepColor, fontWeight: 600, textTransform: 'uppercase' }}>
                                        {t(`steps.${stepType}`) || stepType}
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
                                    label={t('dialog.received_kg', { kg: kgReceived })}
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
                                <StepPipeline steps={pipelineSteps} currentStepId={step?.id} t={t} />
                            </Box>
                        )}

                        {/* Order Details */}
                        {order && (
                            <Box sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, p: 2.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Iconify icon="solar:file-text-bold" width={18} sx={{ color: '#64748b' }} />
                                    {t('dialog.order_info')}
                                </Typography>
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                                    <InfoItem label={t('dialog.order_number')} value={order.order_number} />
                                    <InfoItem label={t('dialog.order_name')} value={order.title} />
                                    <InfoItem label={t('dialog.material')} value={`${order.material || '-'} ${order.sub_material || ''}`} />
                                    <InfoItem label={t('dialog.volume')} value={order.quantity_kg ? `${order.quantity_kg} kg` : null} />
                                    <InfoItem label={t('dialog.film_thickness')} value={order.film_thickness} />
                                    <InfoItem label={t('dialog.film_width')} value={order.film_width} />
                                    <InfoItem label={t('dialog.cylinder_length')} value={order.cylinder_length} />
                                    <InfoItem label={t('dialog.cylinder_count')} value={order.cylinder_count} />
                                    <InfoItem label={t('dialog.cylinder_rotation')} value={order.cylinder_aylanasi} />
                                    <InfoItem label={t('dialog.vtulka')} value={order.vtulka} />
                                    <InfoItem label={t('dialog.napravlenie')} value={order.napravlenie} />
                                </Box>
                            </Box>
                        )}

                        {!readOnly && isSushka && (
                            <>
                                <Divider sx={{ borderStyle: 'dashed', borderColor: '#e2e8f0' }} />

                                {/* Sushka: countdown + kg info */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, py: 2 }}>
                                    {step?.sushka_end_at && (
                                        <SushkaCountdown endAt={step.sushka_end_at} />
                                    )}
                                    <Chip
                                        label={`${kgReceived || 0} kg → ${kgReceived || 0} kg`}
                                        sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 700, fontSize: '0.85rem', border: '1px solid #a7f3d0' }}
                                    />
                                </Box>

                                {/* Next step + brigada info */}
                                {nextStepType && (
                                    <Box sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, p: 2.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Iconify icon="solar:forward-bold" width={18} sx={{ color: '#64748b' }} />
                                                {t('dialog.brigada_for_step', { step: brigadaStepLabel })}
                                            </Typography>
                                            <Chip
                                                label={brigadaStepLabel}
                                                size="small"
                                                sx={{
                                                    bgcolor: `${brigadaStepColor}15`,
                                                    color: brigadaStepColor,
                                                    fontWeight: 700,
                                                    fontSize: '0.7rem',
                                                    textTransform: 'uppercase',
                                                    border: `1.5px solid ${brigadaStepColor}40`,
                                                }}
                                            />
                                        </Box>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>{t('dialog.brigada_for_step', { step: brigadaStepLabel })}</InputLabel>
                                            <Select
                                                label={t('dialog.brigada_for_step', { step: brigadaStepLabel })}
                                                value={sendToBrigada}
                                                onChange={(e) => setSendToBrigada(e.target.value)}
                                            >
                                                {filteredBrigadas.map((b: any) => (
                                                    <MenuItem key={b.id} value={String(b.id)}>{b.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                )}
                            </>
                        )}

                        {!readOnly && !isSushka && (
                            <>
                                <Divider sx={{ borderStyle: 'dashed', borderColor: '#e2e8f0' }} />

                                {/* Materials Section */}
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Iconify icon="solar:inbox-bold" width={18} sx={{ color: '#64748b' }} />
                                        {t('dialog.available_materials')}
                                    </Typography>
                                    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                                        {isStockLoading ? (
                                            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} /></Box>
                                        ) : stock.length === 0 ? (
                                            <Typography variant="body2" sx={{ p: 3, textAlign: 'center', color: '#94a3b8' }}>
                                                {t('dialog.no_materials')}
                                            </Typography>
                                        ) : stock.map((mat, idx) => {
                                            const entered = Number(usageAmounts[mat.ombor_item_id]) || 0;
                                            const isOver = entered > mat.stock_at_machine;
                                            return (
                                            <Box
                                                key={mat.ombor_item_id}
                                                sx={{
                                                    px: 2.5,
                                                    py: 1.5,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    borderBottom: idx !== stock.length - 1 ? '1px solid #f1f5f9' : 'none',
                                                    bgcolor: isOver ? '#fef2f2' : 'transparent',
                                                    '&:hover': { bgcolor: isOver ? '#fef2f2' : '#f8fafc' },
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
                                                            bgcolor: isOver ? '#fef2f2' : mat.stock_at_machine > 0 ? '#ecfdf5' : '#fef2f2',
                                                            color: isOver ? '#dc2626' : mat.stock_at_machine > 0 ? '#059669' : '#dc2626',
                                                            fontWeight: 600,
                                                            fontSize: '0.75rem',
                                                            border: `1px solid ${isOver ? '#fecaca' : mat.stock_at_machine > 0 ? '#a7f3d0' : '#fecaca'}`,
                                                        }}
                                                    />
                                                    <TextField
                                                        size="small"
                                                        placeholder="0"
                                                        error={isOver}
                                                        helperText={isOver ? `max ${mat.stock_at_machine}` : ''}
                                                        value={usageAmounts[mat.ombor_item_id] || ''}
                                                        onChange={(e) => setUsageAmounts({ ...usageAmounts, [mat.ombor_item_id]: e.target.value })}
                                                        sx={{
                                                            width: 100,
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: '#fff',
                                                                '& fieldset': { borderColor: isOver ? '#ef4444' : '#e2e8f0' },
                                                                '&:hover fieldset': { borderColor: isOver ? '#ef4444' : '#94a3b8' },
                                                                '&.Mui-focused fieldset': { borderColor: isOver ? '#ef4444' : stepColor },
                                                            },
                                                            '& input': { textAlign: 'center', color: isOver ? '#dc2626' : '#1e293b', fontWeight: 600 },
                                                            '& .MuiFormHelperText-root': { mx: 0, mt: 0.5, fontSize: '0.65rem' },
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                            );
                                        })}
                                    </Box>
                                </Box>

                                <Divider sx={{ borderStyle: 'dashed', borderColor: '#e2e8f0' }} />

                                {/* Production + Send (merged — same numbers go to both) */}
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Iconify icon="solar:list-bold" width={18} sx={{ color: '#64748b' }} />
                                            {t('dialog.production_result')}
                                        </Typography>
                                        {nextStepType && (
                                            <Chip
                                                label={`→ ${brigadaStepLabel}`}
                                                size="small"
                                                sx={{
                                                    bgcolor: `${brigadaStepColor}15`,
                                                    color: brigadaStepColor,
                                                    fontWeight: 700,
                                                    fontSize: '0.7rem',
                                                    textTransform: 'uppercase',
                                                    border: `1.5px solid ${brigadaStepColor}40`,
                                                }}
                                            />
                                        )}
                                    </Box>
                                    <Stack spacing={2}>
                                        {/* Brigada selector for next step */}
                                        {nextStepType && (
                                            <FormControl fullWidth size="small">
                                                <InputLabel>{t('dialog.brigada_for_step', { step: brigadaStepLabel })}</InputLabel>
                                                <Select
                                                    label={t('dialog.brigada_for_step', { step: brigadaStepLabel })}
                                                    value={sendToBrigada}
                                                    onChange={(e) => setSendToBrigada(e.target.value)}
                                                >
                                                    <MenuItem value="">{t('common.select')}</MenuItem>
                                                    {filteredBrigadas.map((b: any) => (
                                                        <MenuItem key={b.id} value={String(b.id)}>{b.name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                        {/* Sushka duration when next step is sushka */}
                                        {nextIsSushka && (
                                            <Box sx={{ position: 'relative' }}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    type="number"
                                                    label={t('dialog.sushka_duration')}
                                                    placeholder="24"
                                                    value={sushkaDurationHours}
                                                    onChange={(e) => setSushkaDurationHours(e.target.value)}
                                                    slotProps={{ htmlInput: { min: 0, step: 0.5 } }}
                                                />
                                                <Tooltip title={t('dialog.sushka_duration_hint')} arrow placement="top">
                                                    <Box sx={{ position: 'absolute', top: 8, right: 8, cursor: 'help', display: 'flex' }}>
                                                        <Iconify icon="solar:info-circle-bold" width={16} sx={{ color: '#94a3b8' }} />
                                                    </Box>
                                                </Tooltip>
                                            </Box>
                                        )}
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Box sx={{ flex: 1, position: 'relative' }}>
                                                <TextField fullWidth size="small" label={t('dialog.meters_produced')} placeholder="0" value={meters} onChange={(e) => setMeters(e.target.value)} />
                                                <Tooltip title={t('dialog.meters_produced_hint')} arrow placement="top">
                                                    <Box sx={{ position: 'absolute', top: 8, right: 8, cursor: 'help', display: 'flex' }}>
                                                        <Iconify icon="solar:info-circle-bold" width={16} sx={{ color: '#94a3b8' }} />
                                                    </Box>
                                                </Tooltip>
                                            </Box>
                                            <Box sx={{ flex: 1, position: 'relative' }}>
                                                <TextField fullWidth size="small" label={t('dialog.kg_produced')} placeholder="0" value={kg} onChange={(e) => setKg(e.target.value)} error={hasTotalOverflow} />
                                                <Tooltip title={t('dialog.kg_produced_hint')} arrow placement="top">
                                                    <Box sx={{ position: 'absolute', top: 8, right: 8, cursor: 'help', display: 'flex' }}>
                                                        <Iconify icon="solar:info-circle-bold" width={16} sx={{ color: '#94a3b8' }} />
                                                    </Box>
                                                </Tooltip>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Box sx={{ flex: 1, position: 'relative' }}>
                                                <TextField fullWidth size="small" label={t('dialog.kg_waste')} placeholder="0" value={kgWaste} onChange={(e) => setKgWaste(e.target.value)} error={hasTotalOverflow} />
                                                <Tooltip title={t('dialog.kg_waste_hint')} arrow placement="top">
                                                    <Box sx={{ position: 'absolute', top: 8, right: 8, cursor: 'help', display: 'flex' }}>
                                                        <Iconify icon="solar:info-circle-bold" width={16} sx={{ color: '#94a3b8' }} />
                                                    </Box>
                                                </Tooltip>
                                            </Box>
                                            <Box sx={{ flex: 1, position: 'relative' }}>
                                                <TextField fullWidth size="small" label={t('dialog.kg_remaining')} placeholder="0" value={kgOstatok} onChange={(e) => setKgOstatok(e.target.value)} error={hasTotalOverflow} />
                                                <Tooltip title={t('dialog.kg_remaining_hint')} arrow placement="top">
                                                    <Box sx={{ position: 'absolute', top: 8, right: 8, cursor: 'help', display: 'flex' }}>
                                                        <Iconify icon="solar:info-circle-bold" width={16} sx={{ color: '#94a3b8' }} />
                                                    </Box>
                                                </Tooltip>
                                            </Box>
                                        </Box>
                                        {hasTotalOverflow && (
                                            <Typography variant="caption" sx={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Iconify icon="solar:danger-triangle-bold" width={14} />
                                                {t('dialog.kg_total_overflow')} ({kgTotal}/{kgReceived} kg)
                                            </Typography>
                                        )}
                                        {/* Ish turi only for reska */}
                                        {stepType === 'reska' && (
                                            <FormControl fullWidth size="small">
                                                <InputLabel>{t('dialog.work_type')}</InputLabel>
                                                <Select label={t('dialog.work_type')} value={workType} onChange={(e) => setWorkType(e.target.value)}>
                                                    <MenuItem value="">{t('dialog.work_type_none')}</MenuItem>
                                                    {WORK_TYPE_KEYS.map((wk) => (
                                                        <MenuItem key={wk} value={wk}>{t(`work_types.${wk}`)}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                        <TextField fullWidth size="small" label={t('dialog.notes')} placeholder={t('dialog.notes_placeholder')} value={notes} onChange={(e) => setNotes(e.target.value)} />
                                    </Stack>
                                </Box>
                            </>
                        )}

                        {/* Read-only summary */}
                        {readOnly && step && (
                            <Box sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, p: 2.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#334155', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Iconify icon="solar:list-bold" width={18} sx={{ color: '#64748b' }} />
                                    {t('dialog.results')}
                                </Typography>
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                                    <InfoItem label={t('dialog.result_kg_received')} value={step.kg_received} />
                                    <InfoItem label={t('dialog.result_kg_produced')} value={step.kg_produced} />
                                    <InfoItem label={t('dialog.result_meters_produced')} value={step.meters_produced} />
                                    <InfoItem label={t('dialog.result_kg_waste')} value={step.kg_waste} />
                                    <InfoItem label={t('dialog.result_kg_remaining')} value={step.kg_ostatok} />
                                    <Stack spacing={0.25}>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                            {t('dialog.result_status')}
                                        </Typography>
                                        <Chip
                                            label={t(`status.${step.status}`) || step.status}
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
                    {readOnly ? t('dialog.btn_close') : t('dialog.btn_cancel')}
                </Button>
                {!readOnly && (
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={isSaving || hasOverflow || hasTotalOverflow}
                        sx={{
                            bgcolor: stepColor,
                            borderRadius: 1.5,
                            fontWeight: 600,
                            px: 3,
                            '&:hover': { bgcolor: stepColor, filter: 'brightness(0.9)' },
                        }}
                    >
                        {isSaving ? <CircularProgress size={20} color="inherit" /> : t('dialog.btn_save')}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
