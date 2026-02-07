import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { useGetClient } from 'src/hooks/use-clients';

import { useTranslate } from 'src/locales';

import { KlientlarForm } from './client-form';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    id?: number;
};

export function ClientDialog({ open, onClose, id }: Props) {
    const { t } = useTranslate('client');

    const { data: client, isLoading } = useGetClient(id || 0);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                {id ? t('edit_title') : t('create_title')}
            </DialogTitle>

            <DialogContent>
                {id && isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <KlientlarForm
                        client={id ? client : undefined}
                        onSuccess={onClose}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
