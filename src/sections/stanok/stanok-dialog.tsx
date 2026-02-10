
import type { StanokType } from 'src/types/stanok';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetStanok } from 'src/hooks/use-stanok';

import { useTranslate } from 'src/locales';

import { StanokForm } from './stanok-form';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    id?: number;
    defaultType?: StanokType;
};

export function StanokDialog({ open, onClose, id, defaultType }: Props) {
    const { t } = useTranslate('stanok');

    const { data: stanok, isLoading } = useGetStanok(id || 0);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{id ? t('edit_title') : t('create_title')}</DialogTitle>

            <DialogContent sx={{ pt: 2, pb: 2, minHeight: 150, transition: 'all 0.3s ease-in-out' }}>
                {id && isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={150}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <StanokForm
                        stanok={id ? stanok : undefined}
                        onSuccess={onClose}
                        onCancel={onClose}
                        defaultType={defaultType}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
