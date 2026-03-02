import { useState } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { useGetStaffDebts } from 'src/hooks/use-staff-debt';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { StaffDebtDialog } from './staff-debt-dialog';
import { StaffDebtPaymentDialog } from './staff-debt-payment-dialog';
import { StaffDebtHistoryDialog } from './staff-debt-history-dialog';

export function StaffDebtView() {
    const { data: debts = [], isLoading } = useGetStaffDebts();

    const dialog = useBoolean();
    const paymentDialog = useBoolean();
    const historyDialog = useBoolean();

    const [selectedDebtId, setSelectedDebtId] = useState<number | undefined>();

    const handleCreate = () => {
        dialog.onTrue();
    };

    const handlePaymentClick = (id: number) => {
        setSelectedDebtId(id);
        paymentDialog.onTrue();
    };

    const handleHistoryClick = (id: number) => {
        setSelectedDebtId(id);
        historyDialog.onTrue();
    };

    return (
        <Container maxWidth="xl">
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Typography variant="h4">Xodimlar Qarzi / Avansi</Typography>
                <Button variant="contained" color="primary" onClick={handleCreate} startIcon={<Iconify icon="mingcute:add-line" />}>
                    Yangi Avans / Qarz
                </Button>
            </Stack>

            <Card>
                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                    <Scrollbar>
                        <Table size="medium" sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Xodim</TableCell>
                                    <TableCell>Sababi</TableCell>
                                    <TableCell>Umumiy miqdor</TableCell>
                                    <TableCell>Qoldiq</TableCell>
                                    <TableCell>Holati</TableCell>
                                    <TableCell>Sana</TableCell>
                                    <TableCell>Amallar</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                            Yuklanmoqda...
                                        </TableCell>
                                    </TableRow>
                                ) : debts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                            Hech narsa topilmadi.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    debts.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell sx={{ fontWeight: 600 }}>{row.fullname}</TableCell>
                                            <TableCell sx={{ textTransform: 'capitalize' }}>{row.reason}</TableCell>
                                            <TableCell>{fCurrency(row.amount)} UZS</TableCell>
                                            <TableCell sx={{ color: 'error.main', fontWeight: 600 }}>
                                                {fCurrency(row.remaining)} UZS
                                            </TableCell>
                                            <TableCell>
                                                <Label color={row.status === 'paid_off' ? 'success' : 'warning'}>
                                                    {row.status === 'paid_off' ? 'To\'langan' : 'Faol'}
                                                </Label>
                                            </TableCell>
                                            <TableCell>{fDate(row.date)}</TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1}>
                                                    <IconButton size="small" onClick={() => handleHistoryClick(row.id)}>
                                                        <Iconify icon="solar:clock-circle-bold" width={18} />
                                                    </IconButton>
                                                    {row.status === 'active' && (
                                                        <Button
                                                            size="small"
                                                            variant="soft"
                                                            color="success"
                                                            onClick={() => handlePaymentClick(row.id)}
                                                        >
                                                            To&apos;lov
                                                        </Button>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </TableContainer>
            </Card>

            <StaffDebtDialog open={dialog.value} onClose={dialog.onFalse} />
            <StaffDebtPaymentDialog open={paymentDialog.value} onClose={paymentDialog.onFalse} debtId={selectedDebtId} />
            <StaffDebtHistoryDialog open={historyDialog.value} onClose={historyDialog.onFalse} debtId={selectedDebtId} />
        </Container>
    );
}
