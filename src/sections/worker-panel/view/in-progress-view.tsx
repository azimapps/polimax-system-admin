import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import LinearProgress from '@mui/material/LinearProgress';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetStanoklar } from 'src/hooks/use-stanok';
import { useGetPlanItem, useGetPlanItems } from 'src/hooks/use-plan-items';
import { useGetBrigadas, useGetBrigadaMembers } from 'src/hooks/use-brigadas';
import { useGetMySteps, useGetMyBrigada, useGetPlanItemSteps } from 'src/hooks/use-material-usage';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

import { StanokType } from 'src/types/stanok';
import { PlanItemStatus } from 'src/types/plan-item';

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

const STEP_FULL: Record<string, string> = {
    reska: 'Reska',
    pechat: 'Pechat',
    sushka: 'Sushka',
    laminatsiya: 'Laminatsiya',
    tayyor: 'Tayyor',
};

const STATUS_LABEL: Record<string, string> = {
    completed: 'Yakunlangan',
    in_progress: 'Jarayonda',
    pending: 'Kutilmoqda',
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
        <Tooltip
            arrow
            placement="bottom"
            slotProps={{
                tooltip: {
                    sx: { bgcolor: '#fff', maxWidth: 320, p: 0, borderRadius: 1.5, border: '1px solid rgba(145,158,171,0.2)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
                },
                arrow: { sx: { color: '#fff' } },
            }}
            title={
                <Box sx={{ p: 1.5 }}>
                    {sorted.map((step: any) => {
                        const c = STEP_TYPE_COLORS[step.step_type] || '#919eab';
                        const kgR = step.kg_received ?? 0;
                        const kgP = step.kg_produced ?? 0;
                        const kgW = step.kg_waste ?? 0;
                        const statusColor = step.status === 'completed' ? '#16a34a' : step.status === 'in_progress' ? '#d97706' : '#94a3b8';
                        return (
                            <Box key={step.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: step.status === 'completed' ? c : step.status === 'in_progress' ? c : 'rgba(145,158,171,0.3)', flexShrink: 0 }} />
                                <Typography variant="caption" sx={{ fontWeight: 700, color: c, minWidth: 72 }}>
                                    {STEP_FULL[step.step_type] || step.step_type}
                                </Typography>
                                <Typography variant="caption" sx={{ color: statusColor, fontWeight: 600, minWidth: 72 }}>
                                    {STATUS_LABEL[step.status] || step.status}
                                </Typography>
                                {(kgR > 0 || kgP > 0) && (
                                    <Typography variant="caption" sx={{ color: '#64748b', ml: 'auto' }}>
                                        {kgP}/{kgR} kg
                                        {kgW > 0 && <Box component="span" sx={{ color: '#ef4444' }}> (-{kgW})</Box>}
                                    </Typography>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            }
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'default' }}>
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
                            {STEP_SHORT[step.step_type] || '?'}
                        </Box>
                    );
                })}
            </Box>
        </Tooltip>
    );
}

// ----------------------------------------------------------------------

function AdminPlanItemRow({ item, onAction }: { item: any, onAction: (id: number) => void }) {
    const hasEmbeddedOrder = item.order && typeof item.order === 'object' && 'order_number' in item.order;
    const { data: fetchedPlanItem } = useGetPlanItem(item.id, { enabled: !hasEmbeddedOrder && !!item.id });
    const matchedOrder = hasEmbeddedOrder ? item.order : fetchedPlanItem?.order;

    return (
        <TableRow sx={{ '& td': { borderBottom: '1px solid rgba(145, 158, 171, 0.16)' } }}>
            <TableCell sx={{ color: 'success.main', fontWeight: 600 }}>
                {matchedOrder?.order_number || '-'}
            </TableCell>
            <TableCell>
                {matchedOrder?.title || '-'}
            </TableCell>
            <TableCell>
                <StepPipelineCell planItemId={item.id} />
            </TableCell>
            <TableCell>
                0 kg <Box component="span" sx={{ color: 'text.secondary' }}>/ {matchedOrder?.quantity_kg || 0} kg</Box>
            </TableCell>
            <TableCell>
                {fDate(item.start_date)}
            </TableCell>
            <TableCell align="right">
                <IconButton
                    onClick={() => onAction(item.id)}
                    sx={{ bgcolor: 'rgba(34, 197, 94, 0.16)', color: 'success.main', '&:hover': { bgcolor: 'rgba(34, 197, 94, 0.32)' } }}>
                    <Iconify icon="solar:pen-bold" />
                </IconButton>
            </TableCell>
        </TableRow>
    );
}

function StepRow({ step, onAction }: { step: any, onAction: (step: any) => void }) {
    const color = STEP_TYPE_COLORS[step.step_type] || '#919eab';
    const kgReceived = step.kg_received ?? 0;
    const kgProduced = step.kg_produced ?? 0;
    const progress = kgReceived > 0 ? Math.min((kgProduced / kgReceived) * 100, 100) : 0;

    return (
        <TableRow sx={{ '& td': { borderBottom: '1px solid rgba(145, 158, 171, 0.16)' } }}>
            <TableCell>
                <Chip
                    label={step.step_type}
                    size="small"
                    sx={{
                        bgcolor: `${color}22`,
                        color,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                    }}
                />
            </TableCell>
            <TableCell>
                {step.plan_item?.order_title || '-'}
            </TableCell>
            <TableCell>
                <StepPipelineCell planItemId={step.plan_item_id} />
            </TableCell>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ flexGrow: 1, minWidth: 60 }}>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: 'rgba(145, 158, 171, 0.16)',
                                '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 },
                            }}
                        />
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                        {kgProduced}/{kgReceived} kg
                    </Typography>
                </Box>
            </TableCell>
            <TableCell>
                {fDate(step.started_at || step.created_at)}
            </TableCell>
            <TableCell align="right">
                <IconButton
                    onClick={() => onAction(step)}
                    sx={{ bgcolor: 'rgba(34, 197, 94, 0.16)', color: 'success.main', '&:hover': { bgcolor: 'rgba(34, 197, 94, 0.32)' } }}>
                    <Iconify icon="solar:pen-bold" />
                </IconButton>
            </TableCell>
        </TableRow>
    );
}

// ----------------------------------------------------------------------

export function InProgressView() {
    const { user } = useAuthContext();
    const isAdmin = user?.role === 'admin' || user?.role === 'pechat_manager' || user?.role === 'manager';

    // 1. Try to fetch MyBrigada (for workers, will fail 403 for admins, handled correctly by retry: false in useGetMyBrigada usually or we just let it fail gracefully)
    const { data: myData, isLoading: isLoadingMyBrigada } = useGetMyBrigada();

    // 2. Fetch all stanoks and brigadas (used as fallback for admins)
    const { data: stanoks = [] } = useGetStanoklar(undefined, StanokType.PECHAT, { enabled: isAdmin });
    const { data: allBrigadas = [] } = useGetBrigadas({ machine_type: StanokType.PECHAT }, { enabled: isAdmin });

    // 3. Manual selection state
    const [manualStanok, setManualStanok] = useState<number | ''>('');
    const [manualBrigada, setManualBrigada] = useState<number | ''>('');

    // Modal state — for admin: planItemId, for worker: full step object
    const [actionDialogTarget, setActionDialogTarget] = useState<number | null>(null);
    const [actionDialogStep, setActionDialogStep] = useState<any>(null);

    // Determine final values: Use myData if available, else manual selection
    const hasMyData = !!myData;
    const selectedStanok = hasMyData ? myData.machine?.id : manualStanok;
    const selectedBrigada = hasMyData ? myData.brigada?.id : manualBrigada;

    // Filter brigadas by selected stanok (for manual selection)
    const filteredBrigadas = allBrigadas.filter((b: any) => b.machine_id === selectedStanok);

    // Auto-select first active Stanok & Brigada if running in manual mode
    useEffect(() => {
        if (!hasMyData && stanoks.length > 0 && manualStanok === '') {
            setManualStanok(stanoks[0].id);
        }
    }, [hasMyData, stanoks, manualStanok]);

    useEffect(() => {
        if (!hasMyData && manualStanok) {
            if (filteredBrigadas.length > 0 && (manualBrigada === '' || !filteredBrigadas.find((b: any) => b.id === manualBrigada))) {
                setManualBrigada(filteredBrigadas[0].id);
            } else if (filteredBrigadas.length === 0) {
                setManualBrigada('');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasMyData, manualStanok, filteredBrigadas]);

    // Format active names
    const activeStanokName = hasMyData ? myData.machine?.name : (stanoks.find((s: any) => s.id === selectedStanok)?.name || '...');
    const activeBrigadaName = hasMyData ? myData.brigada?.name : (allBrigadas.find((b: any) => b.id === selectedBrigada)?.name || '...');

    // Members mapping logic
    const { data: fetchedMembers = [] } = useGetBrigadaMembers(hasMyData ? 0 : Number(manualBrigada)); // Fetch only if manual mode and has a brigada
    const members = hasMyData ? (myData.members || []) : fetchedMembers;

    // Admin: use /plan-items (requires accountant role)
    const { data: adminPlanItems = [], isLoading: isLoadingAdminPlans } = useGetPlanItems({
        status: PlanItemStatus.IN_PROGRESS,
        machine_id: selectedStanok || undefined,
        brigada_id: selectedBrigada || undefined,
    }, { enabled: isAdmin });

    // Worker: use /material-usage/my-steps (brigada leader auth)
    const { data: workerSteps = [], isLoading: isLoadingWorkerSteps } = useGetMySteps(
        { status: 'in_progress' },
    );

    const isLoadingPlans = isAdmin ? isLoadingAdminPlans : isLoadingWorkerSteps;
    const isLoading = isLoadingMyBrigada || isLoadingPlans;

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                Pechat umumiy
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4, fontSize: '0.9rem' }}>
                Reja bo&apos;yicha bosmaga biriktirilgan buyurtmalar tanlangan stanok va brigada bo&apos;yicha ko&apos;rinadi.
            </Typography>

            <Card sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                    <FormControl fullWidth sx={{ maxWidth: 400 }}>
                        <InputLabel>Stanok</InputLabel>
                        <Select
                            value={selectedStanok || ''}
                            label="Stanok"
                            disabled={hasMyData}
                            onChange={(e) => setManualStanok(e.target.value as number)}
                            sx={{ borderRadius: 1 }}
                        >
                            {hasMyData ? (
                                <MenuItem value={selectedStanok}>
                                    {activeStanokName}
                                </MenuItem>
                            ) : (
                                stanoks.map((stanok: any) => (
                                    <MenuItem key={stanok.id} value={stanok.id}>
                                        {stanok.name}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ maxWidth: 400 }}>
                        <InputLabel>Brigada</InputLabel>
                        <Select
                            value={selectedBrigada || ''}
                            label="Brigada"
                            disabled={hasMyData}
                            onChange={(e) => setManualBrigada(e.target.value as number)}
                            sx={{ borderRadius: 1 }}
                        >
                            {hasMyData ? (
                                <MenuItem value={selectedBrigada}>
                                    {activeBrigadaName}
                                </MenuItem>
                            ) : (
                                filteredBrigadas.map((brigada: any) => (
                                    <MenuItem key={brigada.id} value={brigada.id}>
                                        {brigada.name}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                        <Iconify icon="solar:info-circle-bold" width={20} sx={{ color: 'info.main' }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Tanlangan: <Box component="span" sx={{ color: 'text.primary' }}>{activeStanokName} · {activeBrigadaName}</Box>
                        </Typography>
                    </Box>
                    {members.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 3.5, flexWrap: 'wrap' }}>
                            <Iconify icon="solar:users-group-rounded-bold" width={18} sx={{ color: 'text.disabled' }} />
                            <Typography variant="body2" sx={{ color: 'text.disabled' }}>Brigada a&apos;zolari:</Typography>
                            {members.map((m: any) => (
                                <Box key={m.id} component="span" sx={{ bgcolor: 'rgba(145, 158, 171, 0.16)', px: 1, py: 0.25, borderRadius: 1, fontSize: '0.75rem', color: m.is_leader || m.position === 'operator' ? 'primary.main' : 'text.primary', fontWeight: 500 }}>
                                    {m.fullname || m.worker?.first_name || '...'} ({m.position})
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>

                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                    <Table size="medium">
                        <TableHead sx={{ '& th': { borderBottom: '1px solid rgba(145, 158, 171, 0.24)', bgcolor: 'transparent' } }}>
                            <TableRow>
                                <TableCell>{isAdmin ? 'Buyurtma raqami' : 'Bosqich'}</TableCell>
                                <TableCell>Nomi</TableCell>
                                <TableCell>Bosqichlar</TableCell>
                                <TableCell>Miqdori (kg)</TableCell>
                                <TableCell>Sana</TableCell>
                                <TableCell align="right">Amallar</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                        Yuklanmoqda...
                                    </TableCell>
                                </TableRow>
                            ) : isAdmin ? (
                                adminPlanItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                            Jarayondagi vazifalar topilmadi.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    adminPlanItems.map((item: any) => (
                                        <AdminPlanItemRow key={item.id} item={item} onAction={setActionDialogTarget} />
                                    ))
                                )
                            ) : (
                                workerSteps.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                            Jarayondagi vazifalar topilmadi.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    workerSteps.map((step: any) => (
                                        <StepRow key={step.id} step={step} onAction={(s) => { setActionDialogStep(s); setActionDialogTarget(s.plan_item_id); }} />
                                    ))
                                )
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
