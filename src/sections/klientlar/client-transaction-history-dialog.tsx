import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetFinanceHistory } from 'src/hooks/use-finance';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Currency, FinanceType, PaymentMethod } from 'src/types/finance';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    clientId: number;
    transactionId: number;
};

export function ClientTransactionHistoryDialog({
    open,
    onClose,
    transactionId,
}: Props) {
    const { t } = useTranslate('client');
    const { data: history = [], isLoading } = useGetFinanceHistory(transactionId);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>{t('transaction.history_title')}</DialogTitle>

            <DialogContent
                sx={{
                    minHeight: 200,
                    pb: 2,
                    pt: 2,
                    transition: 'all 0.3s ease-in-out',
                }}
            >
                {isLoading ? (
                    <Box
                        alignItems="center"
                        display="flex"
                        justifyContent="center"
                        minHeight={200}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('transaction.version')}</TableCell>
                                    <TableCell>Turi</TableCell>
                                    <TableCell>{t('transaction.form.value')}</TableCell>
                                    <TableCell>Valyuta</TableCell>
                                    <TableCell>To&apos;lov usuli</TableCell>
                                    <TableCell>{t('transaction.form.exchange_rate')}</TableCell>
                                    <TableCell>{t('transaction.form.date')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {history.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Box
                                                alignItems="center"
                                                display="flex"
                                                gap={1}
                                            >
                                                v{item.version}
                                                {index === 0 && (
                                                    <Chip
                                                        color="primary"
                                                        label={t('transaction.current_version')}
                                                        size="small"
                                                    />
                                                )}
                                                {item.deleted_at && (
                                                    <Chip
                                                        color="error"
                                                        label={t('transaction.deleted')}
                                                        size="small"
                                                    />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                color={item.finance_type === FinanceType.KIRIM ? 'success' : 'error'}
                                                label={item.finance_type === FinanceType.KIRIM ? 'Kirim' : 'Chiqim'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {item.currency === Currency.USD ? '$' : ''}
                                            {item.value.toLocaleString()}
                                            {item.currency === Currency.UZS ? " so'm" : ''}
                                        </TableCell>
                                        <TableCell>
                                            {item.currency === Currency.USD ? 'USD' : 'UZS'}
                                        </TableCell>
                                        <TableCell>
                                            {item.payment_method === PaymentMethod.NAQD ? 'Naqd' : 'Bank'}
                                        </TableCell>
                                        <TableCell>
                                            {item.currency_exchange_rate
                                                ? fCurrency(item.currency_exchange_rate)
                                                : '-'}
                                        </TableCell>
                                        <TableCell>{fDateTime(item.date)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>

            <DialogActions>
                <Button color="inherit" onClick={onClose} variant="outlined">
                    {t('cancel')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
