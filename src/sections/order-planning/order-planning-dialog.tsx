import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetPlanItem } from 'src/hooks/use-plan-items';

import { useTranslate } from 'src/locales';

import { OrderPlanningForm } from './order-planning-form';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    id?: number;
};

export function OrderPlanningDialog({ open, onClose, id }: Props) {
    const { t } = useTranslate('order-planning');

    const { data: planItem, isLoading } = useGetPlanItem(Number(id));

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{id ? t('form.edit_title') : t('form.create_title')}</DialogTitle>
            <DialogContent sx={{ pb: 3 }}>
                {id && isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <OrderPlanningForm planItem={planItem} onSuccess={onClose} />
                )}
            </DialogContent>
        </Dialog>
    );
}
