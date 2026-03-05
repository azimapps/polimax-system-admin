import type { PlanItemListItem } from 'src/types/plan-item';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetPlanItemSteps } from 'src/hooks/use-material-usage';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { PlanItemStatus } from 'src/types/plan-item';

// ----------------------------------------------------------------------

const STEP_TYPE_LABELS: Record<string, string> = {
    reska: 'R',
    pechat: 'P',
    sushka: 'S',
    laminatsiya: 'L',
    tayyor: 'T',
};

const STEP_TYPE_COLORS: Record<string, string> = {
    reska: '#2196f3',
    pechat: '#ff9800',
    sushka: '#f44336',
    laminatsiya: '#9c27b0',
    tayyor: '#4caf50',
};

// ----------------------------------------------------------------------

function StepPipelineCell({ planItemId }: { planItemId: number }) {
    const { data: steps = [], isLoading } = useGetPlanItemSteps(planItemId);

    if (isLoading) {
        return <CircularProgress size={14} />;
    }

    if (steps.length === 0) {
        return <Typography variant="caption" sx={{ color: 'text.disabled' }}>—</Typography>;
    }

    const sorted = [...steps].sort((a: any, b: any) => a.step_number - b.step_number);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            {sorted.map((step: any) => {
                const color = STEP_TYPE_COLORS[step.step_type] || '#919eab';
                const isCompleted = step.status === 'completed';
                const isActive = step.status === 'in_progress';
                const isPending = step.status === 'pending';

                return (
                    <Box
                        key={step.id}
                        title={`${step.step_type} — ${step.status}${step.kg_received ? ` (${step.kg_produced ?? 0}/${step.kg_received} kg)` : ''}`}
                        sx={{
                            width: 22,
                            height: 22,
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.6rem',
                            fontWeight: 800,
                            cursor: 'default',
                            transition: 'all 0.15s',
                            ...(isCompleted && {
                                bgcolor: color,
                                color: '#fff',
                            }),
                            ...(isActive && {
                                bgcolor: `${color}33`,
                                color,
                                border: `1.5px solid ${color}`,
                                animation: 'pulse 2s infinite',
                                '@keyframes pulse': {
                                    '0%, 100%': { opacity: 1 },
                                    '50%': { opacity: 0.6 },
                                },
                            }),
                            ...(isPending && {
                                bgcolor: 'rgba(145, 158, 171, 0.12)',
                                color: 'rgba(145, 158, 171, 0.5)',
                            }),
                        }}
                    >
                        {STEP_TYPE_LABELS[step.step_type] || '?'}
                    </Box>
                );
            })}
        </Box>
    );
}

// ----------------------------------------------------------------------

type Props = {
    planItems: PlanItemListItem[];
    loading: boolean;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
};

export function OrderPlanningTable({ planItems, loading, onView, onEdit, onDelete }: Props) {
    const { t } = useTranslate('order-planning');

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>{t('table.order')}</TableCell>
                        <TableCell>{t('table.machine')}</TableCell>
                        <TableCell>{t('table.brigada')}</TableCell>
                        <TableCell>Bosqichlar</TableCell>
                        <TableCell>{t('table.start_date')}</TableCell>
                        <TableCell>{t('table.end_date')}</TableCell>
                        <TableCell>{t('table.status')}</TableCell>
                        <TableCell align="right">{t('table.actions')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {planItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.order_id}</TableCell>
                            <TableCell>{item.machine_id}</TableCell>
                            <TableCell>{item.brigada_id}</TableCell>
                            <TableCell>
                                <StepPipelineCell planItemId={item.id} />
                            </TableCell>
                            <TableCell>{fDate(item.start_date)}</TableCell>
                            <TableCell>{fDate(item.end_date)}</TableCell>
                            <TableCell>
                                {item.status === PlanItemStatus.FINISHED ? t('finished') : t('in_progress')}
                            </TableCell>
                            <TableCell align="right">
                                <IconButton color="info" onClick={() => onView(item.id)}>
                                    <Iconify icon="solar:eye-bold" />
                                </IconButton>
                                <IconButton color="inherit" onClick={() => onEdit(item.id)}>
                                    <Iconify icon="solar:pen-bold" />
                                </IconButton>
                                <IconButton color="error" onClick={() => onDelete(item.id)}>
                                    <Iconify icon="solar:trash-bin-trash-bold" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}

                    {planItems.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={9} sx={{ py: 3 }}>
                                <EmptyContent title={t('table.no_data')} sx={{ py: 3 }} />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
