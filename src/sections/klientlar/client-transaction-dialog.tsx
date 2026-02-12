import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetClientTransaction } from 'src/hooks/use-client-transactions';

import { useTranslate } from 'src/locales';

import { ClientTransactionForm } from './client-transaction-form';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    clientId: number;
    transactionId?: number;
};

export function ClientTransactionDialog({ open, onClose, clientId, transactionId }: Props) {
    const { t } = useTranslate('client');

    const { data: transaction, isLoading } = useGetClientTransaction(
        clientId,
        transactionId || 0
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                {transactionId
                    ? t('transaction.edit_title')
                    : t('transaction.create_title')}
            </DialogTitle>

            <DialogContent
                sx={{ pt: 2, pb: 2, minHeight: 200, transition: 'all 0.3s ease-in-out' }}
            >
                {transactionId && isLoading ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight={200}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <ClientTransactionForm
                        clientId={clientId}
                        transaction={transactionId ? transaction : undefined}
                        onSuccess={onClose}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
