import type { PaymentMethod } from 'src/types/finance';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetFinance } from 'src/hooks/use-finance';

import { useTranslate } from 'src/locales';

import { FinanceForm } from './finance-form';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    id?: number;
    defaultPaymentMethod?: PaymentMethod;
};

export function FinanceDialog({ open, onClose, id, defaultPaymentMethod }: Props) {
    const { t } = useTranslate('finance');

    const { data: finance, isLoading } = useGetFinance(id || 0);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{id ? t('edit_title') : t('create_title')}</DialogTitle>

            <DialogContent sx={{ pt: 2, pb: 2, minHeight: 200, transition: 'all 0.3s ease-in-out' }}>
                {id && isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <FinanceForm
                        finance={id ? finance : undefined}
                        onSuccess={onClose}
                        defaultPaymentMethod={defaultPaymentMethod}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
