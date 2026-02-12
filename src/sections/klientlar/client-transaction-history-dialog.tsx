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
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetClientTransactionHistory } from 'src/hooks/use-client-transactions';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    clientId: number;
    transactionId: number;
};

export function ClientTransactionHistoryDialog({
    open,
    onClose,
    clientId,
    transactionId,
}: Props) {
    const { t } = useTranslate('client');
    const { data: history = [], isLoading } = useGetClientTransactionHistory(
        clientId,
        transactionId
    );

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
        // Note: Revert endpoint not provided in the API spec
        // This would need to be implemented if the backend supports it
        confirmDialog.onFalse();
        setSelectedVersion(undefined);
        onClose();
    }, [confirmDialog, onClose]);

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>{t('transaction.history_title')}</DialogTitle>

                <DialogContent
                    sx={{
                        minHeight: 200,
                        pb: 2,
                        pt: 2,
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    {isLoading ? (
                        <Box
                            alignItems="center"
                            display="flex"
                            justifyContent="center"
                            minHeight={200}
                        >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t('transaction.version')}</TableCell>
                                        <TableCell>{t('transaction.form.value')}</TableCell>
                                        <TableCell>{t('transaction.form.exchange_rate')}</TableCell>
                                        <TableCell>{t('transaction.form.date')}</TableCell>
                                        <TableCell align="center">
                                            {t('transaction.table.actions')}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {history.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Box
                                                    alignItems="center"
                                                    display="flex"
                                                    gap={1}
                                                >
                                                    v{item.version}
                                                    {index === 0 && (
                                                        <Chip
                                                            color="primary"
                                                            label={t('transaction.current_version')}
                                                            size="small"
                                                        />
                                                    )}
                                                    {item.deleted_at && (
                                                        <Chip
                                                            color="error"
                                                            label={t('transaction.deleted')}
                                                            size="small"
                                                        />
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                ${item.value.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                {fCurrency(item.currency_exchange_rate)}
                                            </TableCell>
                                            <TableCell>{fDateTime(item.date)}</TableCell>
                                            <TableCell align="center">
                                                {index !== 0 && (
                                                    <Button
                                                        color="primary"
                                                        onClick={() =>
                                                            handleRevertClick(item.version)
                                                        }
                                                        size="small"
                                                        startIcon={
                                                            <Iconify icon="solar:restart-bold" />
                                                        }
                                                        variant="outlined"
                                                    >
                                                        {t('transaction.revert_button')}
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
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
                    <Button
                        color="primary"
                        onClick={handleConfirmRevert}
                        variant="contained"
                    >
                        {t('transaction.revert_button')}
                    </Button>
                }
                content={t('transaction.revert_confirm_message')}
                onClose={confirmDialog.onFalse}
                open={confirmDialog.value}
                title={t('transaction.revert_confirm_title', { version: selectedVersion })}
            />
        </>
    );
}
