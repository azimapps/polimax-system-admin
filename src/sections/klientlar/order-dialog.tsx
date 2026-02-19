
import type { Order } from 'src/types/order';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

import { OrderBookForm } from './order-form';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    order?: Order;
};

export function OrderBookDialog({ open, onClose, order }: Props) {
    const { t } = useTranslate('order');

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{order ? t('edit_item') : t('new_item')}</DialogTitle>
            <DialogContent>
                <OrderBookForm order={order} onSuccess={onClose} />
            </DialogContent>
        </Dialog>
    );
}
