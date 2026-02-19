
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

import { useRevertOrder, useGetOrderHistory } from 'src/hooks/use-orders';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    orderId: number;
};

export function OrderHistoryDialog({ open, onClose, orderId }: Props) {
    const { t } = useTranslate('order');
    const { data: history = [], isPending, isError } = useGetOrderHistory(orderId);
    const { mutateAsync: revertOrder } = useRevertOrder(orderId);

    const confirmDialog = useBoolean();
    const [selectedVersion, setSelectedVersion] = useState<number | undefined>();

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
                await revertOrder(selectedVersion);
                confirmDialog.onFalse();
                setSelectedVersion(undefined);
                toast.success('Successfully reverted');
                onClose();
            }
        } catch (error: any) {
            console.error(error);
            toast.error('Error reverting order');
        }
    }, [selectedVersion, revertOrder, confirmDialog, onClose]);

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
                <DialogTitle>Order History</DialogTitle>

                <DialogContent sx={{ minHeight: 200, pb: 2, pt: 2 }}>
                    {isPending ? renderLoading : (
                        <>
                            {isError ? renderError : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Version</TableCell>
                                                <TableCell>Order Number</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Quantity (kg)</TableCell>
                                                <TableCell align="center">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {history.map((item, index) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <Box alignItems="center" display="flex" gap={1}>
                                                            v{item.version}
                                                            {index === 0 && (
                                                                <Chip color="primary" label="Current" size="small" />
                                                            )}
                                                            {item.deleted_at && (
                                                                <Chip color="error" label="Deleted" size="small" />
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{item.order_number}</TableCell>
                                                    <TableCell>
                                                        <Label
                                                            variant="soft"
                                                            color={(item.status === 'finished' && 'success') || 'warning'}
                                                        >
                                                            {t(`form.status_options.${item.status}`)}
                                                        </Label>
                                                    </TableCell>
                                                    <TableCell>{item.quantity_kg}</TableCell>
                                                    <TableCell align="center">
                                                        {index !== 0 && (
                                                            <Button
                                                                color="primary"
                                                                onClick={() => handleRevertClick(item.version)}
                                                                size="small"
                                                                startIcon={<Iconify icon="solar:restart-bold" />}
                                                                variant="outlined"
                                                            >
                                                                Revert
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
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                action={
                    <Button color="primary" onClick={handleConfirmRevert} variant="contained">
                        Revert
                    </Button>
                }
                content={`Are you sure you want to revert to version ${selectedVersion}?`}
                onClose={confirmDialog.onFalse}
                open={confirmDialog.value}
                title="Confirm Revert"
            />
        </>
    );
}
