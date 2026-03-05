import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TableContainer from '@mui/material/TableContainer';

import { useGetStanoklar } from 'src/hooks/use-stanok';
import { useGetMyBrigada, useGetMachineStock } from 'src/hooks/use-material-usage';

import { useAuthContext } from 'src/auth/hooks';

import { StanokType } from 'src/types/stanok';

export function MaterialsView() {
    const { user } = useAuthContext();
    const isAdmin = user?.role === 'admin' || user?.role === 'pechat_manager' || user?.role === 'manager';

    const { data: myData, isLoading: isLoadingMyBrigada } = useGetMyBrigada();
    const { data: stanoks = [] } = useGetStanoklar(undefined, StanokType.PECHAT, { enabled: isAdmin });

    const [manualStanok, setManualStanok] = useState<number | ''>('');

    const hasMyData = !!myData;
    const selectedStanok = hasMyData ? myData.machine?.id : manualStanok;

    useEffect(() => {
        if (!hasMyData && stanoks.length > 0 && manualStanok === '') {
            setManualStanok(stanoks[0].id);
        }
    }, [hasMyData, stanoks, manualStanok]);

    const { data: stock = [], isLoading: isLoadingStock } = useGetMachineStock(selectedStanok || undefined);

    const isLoading = isLoadingMyBrigada || isLoadingStock;

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Mavjud Materiallar
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                        Stanokingizga biriktirilgan va hozirda mavjud bo&apos;lgan barcha xom ashyo materiallari ro&apos;yxati.
                    </Typography>
                </Box>

                <FormControl sx={{ minWidth: 240 }} disabled={hasMyData}>
                    <InputLabel id="stanok-select-label">Stanok (Uskuna)</InputLabel>
                    <Select
                        labelId="stanok-select-label"
                        id="stanok-select"
                        value={selectedStanok || ''}
                        label="Stanok (Uskuna)"
                        onChange={(e) => setManualStanok(e.target.value as number)}
                    >
                        {hasMyData ? (
                            <MenuItem value={myData.machine?.id}>{myData.machine?.name}</MenuItem>
                        ) : (
                            stanoks.map((s) => (
                                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                            ))
                        )}
                    </Select>
                </FormControl>
            </Box>

            <Card sx={{ p: 3, borderRadius: 2 }}>
                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                    <Table size="medium">
                        <TableHead sx={{ '& th': { borderBottom: '1px solid rgba(145, 158, 171, 0.24)', bgcolor: 'transparent' } }}>
                            <TableRow>
                                <TableCell>Nomi</TableCell>
                                <TableCell>Turi</TableCell>
                                <TableCell>Jami olingan</TableCell>
                                <TableCell>Ishlatilgan</TableCell>
                                <TableCell>Qaytarilgan</TableCell>
                                <TableCell align="right">Qoldiq (Mavjud)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                        Yuklanmoqda...
                                    </TableCell>
                                </TableRow>
                            ) : stock.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                        Stanokda materiallar topilmadi.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                stock.map((item: any) => (
                                    <TableRow key={item.ombor_item_id} sx={{ '& td': { borderBottom: '1px solid rgba(145, 158, 171, 0.16)' } }}>
                                        <TableCell sx={{ color: 'text.primary', fontWeight: 600 }}>
                                            {item.ombor_item_name}
                                        </TableCell>
                                        <TableCell sx={{ textTransform: 'capitalize' }}>
                                            {item.ombor_item_type || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {item.total_received} kg/l
                                        </TableCell>
                                        <TableCell sx={{ color: 'warning.main' }}>
                                            {item.total_used} kg/l
                                        </TableCell>
                                        <TableCell sx={{ color: 'error.main' }}>
                                            {item.total_returned} kg/l
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                            {item.stock_at_machine} kg/l
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
