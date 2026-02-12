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

import { useRevertFinance, useGetFinanceHistory } from 'src/hooks/use-finance';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { Currency, FinanceType } from 'src/types/finance';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    financeId: number;
};

export function FinanceHistoryDialog({ open, onClose, financeId }: Props) {
    const { t } = useTranslate('finance');
    const { data: history = [], isLoading } = useGetFinanceHistory(financeId);
    const { mutateAsync: revertFinance } = useRevertFinance(financeId);

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
            await revertFinance(selectedVersion);
            confirmDialog.onFalse();
            setSelectedVersion(undefined);
            onClose();
        }
    }, [selectedVersion, revertFinance, confirmDialog, onClose]);

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
                                        <TableCell>{t('form.finance_type')}</TableCell>
                                        <TableCell>{t('form.value')}</TableCell>
                                        <TableCell>{t('form.date')}</TableCell>
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
                                                    label={t(`form.types.${item.finance_type}`)}
                                                    color={
                                                        item.finance_type === FinanceType.KIRIM
                                                            ? 'success'
                                                            : 'error'
                                                    }
                                                    size="small"
                                                    variant="soft"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {item.currency === Currency.UZS
                                                    ? fCurrency(item.value)
                                                    : `$${item.value.toLocaleString()}`}
                                            </TableCell>
                                            <TableCell>{fDateTime(item.date)}</TableCell>
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
