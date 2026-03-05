import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetPlanItem } from 'src/hooks/use-plan-items';
import { useGetPlanItemSteps } from 'src/hooks/use-material-usage';

import { fDate, fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

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

const STEP_STATUS_LABELS: Record<string, string> = {
    completed: 'Yakunlangan',
    in_progress: 'Jarayonda',
    pending: 'Kutilmoqda',
};

const STEP_STATUS_COLORS: Record<string, 'success' | 'warning' | 'default'> = {
    completed: 'success',
    in_progress: 'warning',
    pending: 'default',
};

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    id?: number;
};

export function OrderPlanningDetailDialog({ open, onClose, id }: Props) {
    const { t } = useTranslate('order-planning');
    const { t: tStanok } = useTranslate('stanok');

    const { data: item, isLoading } = useGetPlanItem(Number(id));
    const { data: steps = [] } = useGetPlanItemSteps(Number(id), { enabled: !!id });

    const renderInfoRow = (label: string, value: any) => (
        <Stack direction="row" justifyContent="space-between" sx={{ py: 1 }}>
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>
                {value || '-'}
            </Typography>
        </Stack>
    );

    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Reja Tafsilotlari {id ? `#${id}` : ''}</Typography>
                <IconButton onClick={onClose}>
                    <Iconify icon="mingcute:close-line" />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <CircularProgress />
                    </Box>
                )}

                {item && (
                    <Scrollbar sx={{ p: 1 }}>
                        <Box
                            gap={3}
                            display="grid"
                            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                        >
                            <Stack spacing={2} component={Paper} variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>Reja Vaqti va Holati</Typography>
                                {renderInfoRow(t('form.start_date'), fDate(item.start_date))}
                                {renderInfoRow(t('form.end_date'), fDate(item.end_date))}
                                {renderInfoRow(t('table.status'), item.status === 'finished' ? t('finished') : t('in_progress'))}
                            </Stack>

                            <Stack spacing={2} component={Paper} variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>Uskuna & Brigada</Typography>
                                {renderInfoRow(t('table.machine'), item.machine?.name)}
                                {renderInfoRow(t('form.machine_type'), item.machine?.type ? tStanok(`type.${item.machine.type}`) : '-')}
                                {renderInfoRow(t('table.brigada'), `${item.brigada?.name || ''} (${item.brigada?.leader || '-'})`)}
                            </Stack>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {item.order && (
                            <Stack spacing={2} component={Paper} variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>Buyurtma Ma&apos;lumotlari</Typography>

                                <Box
                                    gap={2}
                                    display="grid"
                                    gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                                >
                                    <Stack>
                                        {renderInfoRow('Raqami', item.order.order_number)}
                                        {renderInfoRow('Sana', fDateTime(item.order.date))}
                                        {renderInfoRow('Nomi', item.order.title)}
                                        {renderInfoRow('Material', `${item.order.material || ''} ${item.order.sub_material || ''}`)}
                                        {renderInfoRow('Hajmi (kg)', item.order.quantity_kg)}
                                    </Stack>

                                    <Stack>
                                        {renderInfoRow('Qalinligi', item.order.film_thickness)}
                                        {renderInfoRow('Kengligi', item.order.film_width)}
                                        {renderInfoRow('Val uzunligi', item.order.cylinder_length)}
                                        {renderInfoRow('Val soni', item.order.cylinder_count)}
                                        {renderInfoRow('Val aylanmasi', item.order.cylinder_aylanasi)}
                                    </Stack>
                                </Box>
                            </Stack>
                        )}

                        {steps.length > 0 && (
                            <>
                                <Divider sx={{ my: 3 }} />

                                <Stack spacing={2} component={Paper} variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>Ishlab chiqarish bosqichlari</Typography>

                                    {/* Pipeline visualization */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap', py: 1.5, px: 1, bgcolor: 'background.neutral', borderRadius: 1.5 }}>
                                        {[...steps].sort((a: any, b: any) => a.step_number - b.step_number).map((step: any, idx: number) => {
                                            const color = STEP_TYPE_COLORS[step.step_type] || '#919eab';
                                            const icon = step.status === 'completed' ? '✓' : step.status === 'in_progress' ? '●' : '○';
                                            return (
                                                <Box key={step.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.5, borderRadius: 1, bgcolor: step.status === 'in_progress' ? `${color}22` : 'transparent', border: step.status === 'in_progress' ? `1.5px solid ${color}` : '1.5px solid transparent' }}>
                                                        <Typography variant="caption" sx={{ color, fontWeight: 700, fontSize: '0.7rem' }}>{icon}</Typography>
                                                        <Typography variant="caption" sx={{ fontWeight: step.status === 'in_progress' ? 700 : 500, color: step.status !== 'pending' ? color : 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                                                            {STEP_TYPE_LABELS[step.step_type] || step.step_type}
                                                        </Typography>
                                                    </Box>
                                                    {idx < steps.length - 1 && (
                                                        <Typography variant="caption" sx={{ color: 'text.disabled', mx: 0.25 }}>→</Typography>
                                                    )}
                                                </Box>
                                            );
                                        })}
                                    </Box>

                                    {/* Step details */}
                                    <Stack spacing={1.5}>
                                        {[...steps].sort((a: any, b: any) => a.step_number - b.step_number).map((step: any) => {
                                            const color = STEP_TYPE_COLORS[step.step_type] || '#919eab';
                                            const kgReceived = step.kg_received ?? 0;
                                            const kgProduced = step.kg_produced ?? 0;
                                            const progress = kgReceived > 0 ? Math.min((kgProduced / kgReceived) * 100, 100) : 0;

                                            return (
                                                <Box key={step.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1, px: 1.5, borderRadius: 1, bgcolor: 'background.neutral' }}>
                                                    <Chip
                                                        label={STEP_TYPE_LABELS[step.step_type] || step.step_type}
                                                        size="small"
                                                        sx={{ bgcolor: `${color}22`, color, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem', minWidth: 90 }}
                                                    />
                                                    <Chip
                                                        label={STEP_STATUS_LABELS[step.status] || step.status}
                                                        size="small"
                                                        color={STEP_STATUS_COLORS[step.status] || 'default'}
                                                        sx={{ fontSize: '0.65rem', minWidth: 80 }}
                                                    />
                                                    {(step.brigada_name || step.machine_name) && (
                                                        <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', minWidth: 100 }}>
                                                            {step.brigada_name}{step.brigada_name && step.machine_name ? ' · ' : ''}{step.machine_name}
                                                        </Typography>
                                                    )}
                                                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={progress}
                                                            sx={{ flexGrow: 1, height: 6, borderRadius: 3, bgcolor: 'rgba(145, 158, 171, 0.16)', '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 } }}
                                                        />
                                                        <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', minWidth: 80, textAlign: 'right' }}>
                                                            {kgProduced}/{kgReceived} kg
                                                        </Typography>
                                                    </Box>
                                                    {step.kg_waste != null && step.kg_waste > 0 && (
                                                        <Typography variant="caption" sx={{ color: 'error.main', whiteSpace: 'nowrap' }}>
                                                            -{step.kg_waste} kg
                                                        </Typography>
                                                    )}
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                </Stack>
                            </>
                        )}
                    </Scrollbar>
                )}
            </DialogContent>
        </Dialog>
    );
}
