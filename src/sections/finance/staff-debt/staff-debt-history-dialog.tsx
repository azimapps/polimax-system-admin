import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetStaffDebtDetail } from 'src/hooks/use-staff-debt';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

type Props = {
    open: boolean;
    onClose: () => void;
    debtId?: number;
};

export function StaffDebtHistoryDialog({ open, onClose, debtId }: Props) {
    const { data: debtDetail, isLoading } = useGetStaffDebtDetail(debtId);

    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
            <DialogTitle>Moliya tarixi yozuvi</DialogTitle>

            <DialogContent sx={{ minHeight: 400, pt: 3, pb: 2 }}>
                {!debtId || isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress />
                    </Box>
                ) : !debtDetail ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Typography color="text.secondary">Ma&apos;lumot topilmadi</Typography>
                    </Box>
                ) : (
                    <Box>
                        <Box
                            sx={{
                                display: 'grid',
                                gap: 2,
                                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                                mb: 3,
                            }}
                        >
                            <Box>
                                <Typography variant="caption" color="text.secondary">Xodim</Typography>
                                <Typography variant="body2">{debtDetail.fullname}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Sabab</Typography>
                                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                    {debtDetail.reason}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Umumiy qarz / avans</Typography>
                                <Typography variant="body2">{fCurrency(debtDetail.amount)} UZS</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Qoldiq</Typography>
                                <Typography variant="body2" color="error">
                                    {fCurrency(debtDetail.remaining)} UZS
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Holati</Typography>
                                <Typography variant="body2" color={debtDetail.status === 'paid_off' ? 'success.main' : 'warning.main'}>
                                    {debtDetail.status === 'paid_off' ? 'To\'langan' : 'Faol'}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Sanasi</Typography>
                                <Typography variant="body2">
                                    {fDateTime(debtDetail.date)}
                                </Typography>
                            </Box>
                        </Box>

                        <Typography variant="h6" sx={{ mb: 2 }}>To&apos;lovlar tarixi</Typography>
                        {debtDetail.payments.length === 0 ? (
                            <Typography color="text.secondary" variant="body2">
                                Hali hech qanday to&apos;lov amalga oshirilmagan.
                            </Typography>
                        ) : (
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Sana</TableCell>
                                        <TableCell>To&apos;lov Turi</TableCell>
                                        <TableCell align="right">Summa</TableCell>
                                        <TableCell>Izoh</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {debtDetail.payments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>{fDateTime(payment.date)}</TableCell>
                                            <TableCell sx={{ textTransform: 'capitalize' }}>
                                                {payment.payment_method.replace('_', ' ')}
                                            </TableCell>
                                            <TableCell align="right" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                                {fCurrency(payment.amount)}
                                            </TableCell>
                                            <TableCell>{payment.notes || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}
