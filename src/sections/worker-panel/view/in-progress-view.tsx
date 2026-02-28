import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import TableContainer from '@mui/material/TableContainer';

import { useGetOrders } from 'src/hooks/use-orders';
import { useGetStanoklar } from 'src/hooks/use-stanok';
import { useGetPlanItems } from 'src/hooks/use-plan-items';
import { useGetMyBrigada } from 'src/hooks/use-material-usage';
import { useGetMyBrigadaPlanItems } from 'src/hooks/use-worker-panel';
import { useGetBrigadas, useGetBrigadaMembers } from 'src/hooks/use-brigadas';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

import { StanokType } from 'src/types/stanok';
import { PlanItemStatus } from 'src/types/plan-item';

import { ActionDialog } from './action-dialog';

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

    // Modal state
    const [actionDialogTarget, setActionDialogTarget] = useState<number | null>(null);

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
    const activeStanokName = hasMyData ? myData.machine?.name : (stanoks.find(s => s.id === selectedStanok)?.name || '...');
    const activeBrigadaName = hasMyData ? myData.brigada?.name : (allBrigadas.find((b: any) => b.id === selectedBrigada)?.name || '...');

    // Members mapping logic
    const { data: fetchedMembers = [] } = useGetBrigadaMembers(hasMyData ? 0 : Number(manualBrigada)); // Fetch only if manual mode and has a brigada
    const members = hasMyData ? (myData.members || []) : fetchedMembers;

    // Fetch in_progress plan items using current filters (Admin UI uses original plan items hook)
    const { data: adminPlanItems = [], isLoading: isLoadingAdminPlans } = useGetPlanItems({
        status: PlanItemStatus.IN_PROGRESS,
        machine_id: selectedStanok || undefined,
        brigada_id: selectedBrigada || undefined,
    }, { enabled: isAdmin });

    // Workers use useGetMyBrigadaPlanItems specifically
    // We determine true worker API by user role!
    const { data: workerPlanItems = [], isLoading: isLoadingWorkerPlans } = useGetMyBrigadaPlanItems({ status: PlanItemStatus.IN_PROGRESS });

    const planItems = isAdmin ? adminPlanItems : workerPlanItems;
    const isLoadingPlans = isAdmin ? isLoadingAdminPlans : isLoadingWorkerPlans;

    // Fetch orders to map plan_item.order_id -> Order details (Only Admins need this)
    const { data: orders = [] } = useGetOrders(undefined, { enabled: isAdmin });

    const isLoading = isLoadingMyBrigada || isLoadingPlans;

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                Pechat umumiy
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4, fontSize: '0.9rem' }}>
                Reja bo&apos;yicha bosmaga biriktirilgan buyurtmalar tanlangan stanok va brigada bo&apos;yicha ko&apos;rinadi.
            </Typography>

            <Card sx={{ p: 3, borderRadius: 2, bgcolor: '#1C252E' }}>
                <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                    <FormControl fullWidth sx={{ maxWidth: 400 }}>
                        <InputLabel>Stanok</InputLabel>
                        <Select
                            value={selectedStanok || ''}
                            label="Stanok"
                            disabled={hasMyData}
                            onChange={(e) => setManualStanok(e.target.value as number)}
                            sx={{
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                            }}
                        >
                            {hasMyData ? (
                                <MenuItem value={selectedStanok}>
                                    {activeStanokName}
                                </MenuItem>
                            ) : (
                                stanoks.map(stanok => (
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
                            sx={{
                                bgcolor: 'background.paper',
                                borderRadius: 1
                            }}
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

                <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                    <Table size="medium">
                        <TableHead sx={{ '& th': { borderBottom: '1px solid rgba(145, 158, 171, 0.24)', bgcolor: 'transparent' } }}>
                            <TableRow>
                                <TableCell>Buyurtma raqami</TableCell>
                                <TableCell>Mijoz</TableCell>
                                <TableCell>Nomi</TableCell>
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
                            ) : planItems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                        Jarayondagi vazifalar topilmadi.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                planItems.map((item: any) => {
                                    // Try to use the embedded order object if the backend provides it, otherwise search via useGetOrders array
                                    const matchedOrder = item.order || orders.find((o) => o.id === item.order_id);

                                    return (
                                        <TableRow key={item.id} sx={{ '& td': { borderBottom: '1px solid rgba(145, 158, 171, 0.16)' } }}>
                                            <TableCell sx={{ color: 'success.main', fontWeight: 600 }}>
                                                {matchedOrder?.order_number || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {matchedOrder?.client?.fullname || matchedOrder?.client?.first_name || matchedOrder?.client_id || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {matchedOrder?.title || '-'}
                                            </TableCell>
                                            <TableCell>
                                                0 kg <Box component="span" sx={{ color: 'text.secondary' }}>/ {matchedOrder?.quantity_kg || 0} kg</Box>
                                            </TableCell>
                                            <TableCell>
                                                {fDate(item.start_date)}
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    onClick={() => setActionDialogTarget(item.id)}
                                                    sx={{ bgcolor: 'rgba(34, 197, 94, 0.16)', color: 'success.main', '&:hover': { bgcolor: 'rgba(34, 197, 94, 0.32)' } }}>
                                                    <Iconify icon="solar:info-circle-bold" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            <ActionDialog
                open={!!actionDialogTarget}
                onClose={() => setActionDialogTarget(null)}
                planItemId={actionDialogTarget}
            />
        </Box>
    );
}
