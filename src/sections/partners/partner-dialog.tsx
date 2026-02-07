import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetPartner } from 'src/hooks/use-partners';

import { useTranslate } from 'src/locales';

import { PartnerForm } from './partner-form';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    id?: number;
};

export function PartnerDialog({ open, onClose, id }: Props) {
    const { t } = useTranslate('partner');

    const { data: partner, isLoading } = useGetPartner(id || 0);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{id ? t('edit_title') : t('create_title')}</DialogTitle>

            <DialogContent sx={{ pt: 2, pb: 2, minHeight: 200, transition: 'all 0.3s ease-in-out' }}>
                {id && isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <PartnerForm partner={id ? partner : undefined} onSuccess={onClose} />
                )}
            </DialogContent>
        </Dialog>
    );
}
