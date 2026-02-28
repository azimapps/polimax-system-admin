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

import { useGetStanoklar } from 'src/hooks/use-stanok';
import { useGetBrigadas } from 'src/hooks/use-brigadas';
import { useGetPlanItems } from 'src/hooks/use-plan-items';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { StanokType } from 'src/types/stanok';
import { PlanItemStatus } from 'src/types/plan-item';

export function InProgressView() {
    const [selectedStanok, setSelectedStanok] = useState<number | ''>('');
    const [selectedBrigada, setSelectedBrigada] = useState<number | ''>('');

    const { data: stanoks = [] } = useGetStanoklar(undefined, StanokType.PECHAT);

    // Auto select first stanok
    useEffect(() => {
        if (stanoks.length > 0 && selectedStanok === '') {
            setSelectedStanok(stanoks[0].id);
        }
    }, [stanoks, selectedStanok]);

    // Fetch brigadas for `pechat` type
    const { data: allBrigadas = [] } = useGetBrigadas({ machine_type: StanokType.PECHAT });

    // Filter brigadas by selected stanok
    const filteredBrigadas = allBrigadas.filter((b: any) => b.machine_id === selectedStanok);

    // Auto select first brigada when stanok changes
    useEffect(() => {
        if (filteredBrigadas.length > 0 && (selectedBrigada === '' || !filteredBrigadas.find((b: any) => b.id === selectedBrigada))) {
            setSelectedBrigada(filteredBrigadas[0].id);
        } else if (filteredBrigadas.length === 0) {
            setSelectedBrigada('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredBrigadas, selectedStanok]);

    // Fetch in_progress plan items using current filters
    const { data: planItems = [], isLoading } = useGetPlanItems({
        status: PlanItemStatus.IN_PROGRESS,
        machine_id: selectedStanok || undefined,
        brigada_id: selectedBrigada || undefined,
    });

    const activeStanokName = stanoks.find(s => s.id === selectedStanok)?.name || '...';
    const activeBrigadaName = allBrigadas.find((b: any) => b.id === selectedBrigada)?.name || '...';

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
                            value={selectedStanok}
                            label="Stanok"
                            onChange={(e) => setSelectedStanok(e.target.value as number)}
                            sx={{
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                            }}
                        >
                            {stanoks.map(stanok => (
                                <MenuItem key={stanok.id} value={stanok.id}>
                                    {stanok.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ maxWidth: 400 }}>
                        <InputLabel>Brigada</InputLabel>
                        <Select
                            value={selectedBrigada}
                            label="Brigada"
                            onChange={(e) => setSelectedBrigada(e.target.value as number)}
                            sx={{
                                bgcolor: 'background.paper',
                                borderRadius: 1
                            }}
                        >
                            {filteredBrigadas.map((brigada: any) => (
                                <MenuItem key={brigada.id} value={brigada.id}>
                                    {brigada.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
                    <Iconify icon="solar:info-circle-bold" width={20} sx={{ color: 'info.main' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Tanlangan: <Box component="span" sx={{ color: 'text.primary' }}>{activeStanokName} · {activeBrigadaName}</Box>
                    </Typography>
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
                                planItems.map((item: any) => (
                                    <TableRow key={item.id} sx={{ '& td': { borderBottom: '1px solid rgba(145, 158, 171, 0.16)' } }}>
                                        <TableCell sx={{ color: 'success.main', fontWeight: 600 }}>
                                            {item.order?.order_number || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {item.order?.client?.fullname || item.order?.client?.first_name || item.order?.client_id || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {item.order?.title || '-'}
                                        </TableCell>
                                        <TableCell>
                                            0 kg <Box component="span" sx={{ color: 'text.secondary' }}>/ {item.order?.quantity_kg || 0} kg</Box>
                                        </TableCell>
                                        <TableCell>
                                            {fDate(item.start_date)}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton sx={{ bgcolor: 'rgba(34, 197, 94, 0.16)', color: 'success.main', '&:hover': { bgcolor: 'rgba(34, 197, 94, 0.32)' } }}>
                                                <Iconify icon="solar:info-circle-bold" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
}
