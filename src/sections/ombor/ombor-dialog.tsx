
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useTranslate } from 'src/locales';
import { useGetOmborItem } from 'src/hooks/use-ombor';

import { OmborForm } from './ombor-form';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    id?: number;
};

export function OmborDialog({ open, onClose, id }: Props) {
    const { t } = useTranslate('ombor');

    const { data: item, isLoading } = useGetOmborItem(id || 0);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{id ? t('edit_title') || 'Mahsulotni Tahrirlash' : t('new_item')}</DialogTitle>

            <DialogContent sx={{ minHeight: 150 }}>
                {id && isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <OmborForm
                        item={id ? item : undefined}
                        onCancel={onClose}
                        onSuccess={() => {
                            onClose();
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
