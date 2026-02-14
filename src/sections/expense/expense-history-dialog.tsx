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

import { useRevertExpense, useGetExpenseHistory } from 'src/hooks/use-expense';

import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    expenseId: number;
};

export function ExpenseHistoryDialog({ open, onClose, expenseId }: Props) {
    const { t } = useTranslate('expense');
    const { data: history = [], isLoading } = useGetExpenseHistory(expenseId);
    const { mutateAsync: revertExpense } = useRevertExpense(expenseId);

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
        if (selectedVersion) {
            await revertExpense(selectedVersion);
            confirmDialog.onFalse();
            setSelectedVersion(undefined);
            onClose();
        }
    }, [selectedVersion, revertExpense, confirmDialog, onClose]);

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>{t('history_title')}</DialogTitle>

                <DialogContent sx={{ minHeight: 200, pb: 2, pt: 2, transition: 'all 0.3s ease-in-out' }}>
                    {isLoading ? (
                        <Box alignItems="center" display="flex" justifyContent="center" minHeight={200}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t('version')}</TableCell>
                                        <TableCell>{t('form.category')}</TableCell>
                                        <TableCell>{t('form.frequency')}</TableCell>
                                        <TableCell>{t('form.amount')}</TableCell>
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
                                                        <Chip
                                                            color="primary"
                                                            label={t('current_version')}
                                                            size="small"
                                                        />
                                                    )}
                                                    {item.deleted_at && (
                                                        <Chip color="error" label={t('deleted')} size="small" />
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={t(`form.categories.${item.category}`)}
                                                    size="small"
                                                    variant="soft"
                                                    color="primary"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={t(`form.frequencies.${item.frequency}`)}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>{fCurrency(item.amount)}</TableCell>
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
