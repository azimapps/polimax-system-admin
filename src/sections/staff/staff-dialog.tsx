
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetStaffMember } from 'src/hooks/use-staff';

import { useTranslate } from 'src/locales';

import { StaffType } from 'src/types/staff';

import { StaffForm } from './staff-form';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    id?: number;
    fixedType?: StaffType;
};

export function StaffDialog({ open, onClose, id, fixedType }: Props) {
    const { t } = useTranslate('staff');

    const { data: staff, isLoading } = useGetStaffMember(id || 0);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{id ? t('edit_title') : t('create_title')}</DialogTitle>

            <DialogContent sx={{ pt: 2, pb: 2, minHeight: 200, transition: 'all 0.3s ease-in-out' }}>
                {id && isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <StaffForm staff={id ? staff : undefined} onSuccess={onClose} onCancel={onClose} fixedType={fixedType} />
                )}
            </DialogContent>
        </Dialog>
    );
}
