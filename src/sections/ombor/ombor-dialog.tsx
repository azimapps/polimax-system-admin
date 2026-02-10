
import type { OmborItem } from 'src/types/ombor';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

import { OmborForm } from './ombor-form';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    item?: OmborItem;
};

export function OmborDialog({ open, onClose, item }: Props) {
    const { t } = useTranslate('ombor');

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{item ? t('edit_title') || 'Materialni Tahrirlash' : t('new_item')}</DialogTitle>

            <DialogContent>
                <OmborForm
                    item={item}
                    onCancel={onClose}
                    onSuccess={() => {
                        onClose();
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
