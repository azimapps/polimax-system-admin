import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetMySteps, useGetPlanItemSteps } from 'src/hooks/use-material-usage';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

import { ActionDialog } from './action-dialog';

// ----------------------------------------------------------------------

const STEP_TYPE_COLORS: Record<string, string> = {
    reska: '#2196f3',
    pechat: '#ff9800',
    sushka: '#f44336',
    laminatsiya: '#9c27b0',
    tayyor: '#4caf50',
};

const STEP_SHORT: Record<string, string> = {
    reska: 'R',
    pechat: 'P',
    sushka: 'S',
    laminatsiya: 'L',
    tayyor: 'T',
};

// ----------------------------------------------------------------------

function StepPipelineCell({ planItemId, t }: { planItemId: number; t: any }) {
    const { data: steps = [], isLoading } = useGetPlanItemSteps(planItemId);

    if (isLoading) return <CircularProgress size={14} />;
    if (steps.length === 0) return <Typography variant="caption" sx={{ color: 'text.disabled' }}>—</Typography>;

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
                        sx={{
                            width: 22,
                            height: 22,
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.6rem',
                            fontWeight: 800,
                            transition: 'all 0.15s',
                            ...(isCompleted && { bgcolor: color, color: '#fff' }),
                            ...(isActive && {
                                bgcolor: `${color}33`,
                                color,
                                border: `1.5px solid ${color}`,
                                animation: 'pulse 2s infinite',
                                '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.6 } },
                            }),
                            ...(isPending && { bgcolor: 'rgba(145, 158, 171, 0.12)', color: 'rgba(145, 158, 171, 0.5)' }),
                        }}
                    >
                        {STEP_SHORT[step.step_type] || '?'}
                    </Box>
                );
            })}
        </Box>
    );
}

// ----------------------------------------------------------------------

function SushkaCountdownCell({ endAt }: { endAt: string }) {
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
                label="Tayyor!"
                size="small"
                sx={{ bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 700 }}
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
            gap: 0.5,
            px: 1.5,
            py: 0.5,
            borderRadius: 1.5,
            bgcolor: '#fef3c7',
            border: '1px solid #fde68a',
        }}>
            <Iconify icon="solar:clock-circle-bold" width={16} sx={{ color: '#d97706' }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#92400e', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                {timeStr}
            </Typography>
        </Box>
    );
}

// ----------------------------------------------------------------------

function SushkaStepRow({ step, onAction, t }: { step: any; onAction: (step: any) => void; t: any }) {
    const color = STEP_TYPE_COLORS.sushka;
    const kgReceived = step.kg_received ?? 0;

    return (
        <TableRow sx={{ '& td': { borderBottom: '1px solid rgba(145, 158, 171, 0.16)' } }}>
            <TableCell>
                <Chip
                    label={t('steps.sushka')}
                    size="small"
                    sx={{ bgcolor: `${color}22`, color, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem' }}
                />
            </TableCell>
            <TableCell>
                {step.plan_item?.order_title || step.order_title || '-'}
            </TableCell>
            <TableCell>
                <StepPipelineCell planItemId={step.plan_item_id} t={t} />
            </TableCell>
            <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {kgReceived} kg
                </Typography>
            </TableCell>
            <TableCell>
                {step.sushka_end_at ? (
                    <SushkaCountdownCell endAt={step.sushka_end_at} />
                ) : (
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>—</Typography>
                )}
            </TableCell>
            <TableCell align="right">
                <IconButton
                    onClick={() => onAction(step)}
                    sx={{ bgcolor: `${color}16`, color, '&:hover': { bgcolor: `${color}32` } }}
                >
                    <Iconify icon="solar:pen-bold" />
                </IconButton>
            </TableCell>
        </TableRow>
    );
}

// ----------------------------------------------------------------------

type SushkaViewProps = {
    translationNs?: string;
};

export function SushkaView({ translationNs = 'pechat-panel' }: SushkaViewProps) {
    const { t } = useTranslate(translationNs);
    const { user } = useAuthContext();
    const isAdmin = user?.role === 'admin' || user?.role === 'pechat_manager' || user?.role === 'manager';

    // Fetch sushka steps still drying (timer not expired)
    const { data: sushkaSteps = [], isLoading } = useGetMySteps({ status: 'in_progress', sushka_ready: false });

    // Action dialog state
    const [actionDialogTarget, setActionDialogTarget] = useState<number | null>(null);
    const [actionDialogStep, setActionDialogStep] = useState<any>(null);

    const handleAction = (step: any) => {
        setActionDialogStep(step);
        setActionDialogTarget(step.plan_item_id);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                {t('sushka.title')}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4, fontSize: '0.9rem' }}>
                {t('sushka.description')}
            </Typography>

            <Card sx={{ p: 3, borderRadius: 2 }}>
                {!isAdmin && (
                    <Box sx={{ mb: 2, p: 1.5, bgcolor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Iconify icon="solar:info-circle-bold" width={18} sx={{ color: '#ea580c' }} />
                        <Typography variant="caption" sx={{ color: '#9a3412' }}>
                            {t('sushka.auto_note')}
                        </Typography>
                    </Box>
                )}

                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                    <Table size="medium">
                        <TableHead sx={{ '& th': { borderBottom: '1px solid rgba(145, 158, 171, 0.24)', bgcolor: 'transparent' } }}>
                            <TableRow>
                                <TableCell>{t('table.step')}</TableCell>
                                <TableCell>{t('table.name')}</TableCell>
                                <TableCell>{t('table.steps')}</TableCell>
                                <TableCell>{t('table.quantity_kg')}</TableCell>
                                <TableCell>{t('sushka.countdown') || 'Countdown'}</TableCell>
                                <TableCell align="right">{t('table.actions')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                        {t('common.loading')}
                                    </TableCell>
                                </TableRow>
                            ) : sushkaSteps.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                        {t('sushka.empty')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sushkaSteps.map((step: any) => (
                                    <SushkaStepRow key={step.id} step={step} onAction={handleAction} t={t} />
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            <ActionDialog
                open={!!actionDialogTarget}
                onClose={() => { setActionDialogTarget(null); setActionDialogStep(null); }}
                planItemId={actionDialogTarget}
                step={actionDialogStep}
            />
        </Box>
    );
}
