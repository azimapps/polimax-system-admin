import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useRevertLead, useGetLeadHistory } from 'src/hooks/use-leads';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    leadId: number;
};

export function LeadHistoryDialog({ open, onClose, leadId }: Props) {
    const { t } = useTranslate('lead');
    const { data: history = [], isPending, isError } = useGetLeadHistory(leadId);
    const { mutateAsync: revertLead } = useRevertLead(leadId);

    const confirmDialog = useBoolean();
    const [selectedVersion, setSelectedVersion] = useState<number | undefined>();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'qiziqishi_bor':
                return 'primary';
            case 'juda_qiziqdi':
                return 'success';
            case 'yangi':
                return 'info';
            case 'rad_etildi':
                return 'error';
            case 'mijozga_aylandi':
                return 'warning';
            default:
                return 'default';
        }
    };

    const handleRevertClick = useCallback(
        (version: number) => {
            setSelectedVersion(version);
            confirmDialog.onTrue();
        },
        [confirmDialog]
    );

    const handleConfirmRevert = useCallback(async () => {
        try {
            if (selectedVersion) {
                await revertLead(selectedVersion);
                confirmDialog.onFalse();
                setSelectedVersion(undefined);
                toast.success('Successfully reverted');
                onClose();
            }
        } catch (error: any) {
            console.error(error);
            const errorMessage = error?.response?.data?.message || t('messages.error_generic') || 'Error reverting lead';
            toast.error(errorMessage);
        }
    }, [selectedVersion, revertLead, confirmDialog, onClose, t]); // Added t to dependencies

    const renderLoading = (
        <Box alignItems="center" display="flex" justifyContent="center" minHeight={200}>
            <CircularProgress />
        </Box>
    );

    const renderError = (
        <Box alignItems="center" display="flex" justifyContent="center" minHeight={200} color="error.main">
            <Typography variant="body2">Error loading history</Typography>
        </Box>
    );

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>{t('history_title')}</DialogTitle>

                <DialogContent sx={{ minHeight: 200, pb: 2, pt: 2 }}>
                    {isPending ? renderLoading : (
                        <>
                            {isError ? renderError : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>{t('version')}</TableCell>
                                                <TableCell>{t('form.fullname')}</TableCell>
                                                <TableCell>{t('form.status')}</TableCell>
                                                <TableCell>{t('form.company')}</TableCell>
                                                <TableCell align="center">{t('table.actions')}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {history.map((item, index) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <Box alignItems="center" display="flex" gap={1}>
                                                            v{item.version}
                                                            {index === 0 && (
                                                                <Chip color="primary" label={t('current_version')} size="small" />
                                                            )}
                                                            {item.deleted_at && (
                                                                <Chip color="error" label={t('deleted')} size="small" />
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{item.fullname}</TableCell>
                                                    <TableCell>
                                                        <Label variant="soft" color={getStatusColor(item.status)}>
                                                            {t(`status.${item.status}`)}
                                                        </Label>
                                                    </TableCell>
                                                    <TableCell>{item.company || '-'}</TableCell>
                                                    <TableCell align="center">
                                                        {index !== 0 && (
                                                            <Button
                                                                color="primary"
                                                                onClick={() => handleRevertClick(item.version)}
                                                                size="small"
                                                                startIcon={<Iconify icon="solar:restart-bold" />}
                                                                variant="outlined"
                                                            >
                                                                {t('revert_button')}
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button color="inherit" onClick={onClose} variant="outlined">
                        {t('cancel')}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                action={
                    <Button color="primary" onClick={handleConfirmRevert} variant="contained">
                        {t('revert_button')}
                    </Button>
                }
                content={t('revert_confirm_message')}
                onClose={confirmDialog.onFalse}
                open={confirmDialog.value}
                title={t('revert_confirm_title', { version: selectedVersion })}
            />
        </>
    );
}
