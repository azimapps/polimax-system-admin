import type { OmborItem } from 'src/types/ombor';

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

import { useRevertOmborItem, useGetOmborItemHistory } from 'src/hooks/use-ombor';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { OmborType } from 'src/types/ombor';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    id?: number;
    type: OmborType;
};

export function OmborHistoryDialog({ open, onClose, id, type }: Props) {
    const { t } = useTranslate('ombor');
    const { data: history = [], isLoading } = useGetOmborItemHistory(type, id || 0);
    const { mutateAsync: revertItem } = useRevertOmborItem(type, id || 0);

    const confirmDialog = useBoolean();
    const [selectedVersion, setSelectedVersion] = useState<number | undefined>();

    const getQuantityDisplay = (item: OmborItem) => {
        switch (item.ombor_type) {
            case OmborType.PLYONKA:
            case OmborType.KRASKA:
            case OmborType.SUYUQ_KRASKA:
            case OmborType.OTXOT:
                return `${item.total_kg || 0} kg`;
            case OmborType.RASTVARITEL:
            case OmborType.ARALASHMASI:
                return `${item.total_liter || 0} L`;
            case OmborType.SILINDIR:
            case OmborType.KLEY:
            case OmborType.TAYYOR_TOSHKENT:
            case OmborType.TAYYOR_ANGREN:
            case OmborType.ZAPCHASTLAR:
                return `${item.quantity || item.barrels || 0} dona/bochka`;
            default:
                return `${item.quantity || item.total_kg || item.total_liter || 0}`;
        }
    };

    const getPriceDisplay = (item: OmborItem) => {
        let price = item.price || 0;

        if (!price) {
            if (item.price_per_kg && item.total_kg) {
                price = item.price_per_kg * item.total_kg;
            } else if (item.price_per_liter && item.total_liter) {
                price = item.price_per_liter * item.total_liter;
            }
        }

        const formattedPrice = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price || 0);

        const currency = item.price_currency ? item.price_currency.toUpperCase() : 'USD';
        return `${formattedPrice} ${currency}`;
    };

    const handleRevertClick = useCallback(
        (version: number) => {
            setSelectedVersion(version);
            confirmDialog.onTrue();
        },
        [confirmDialog]
    );

    const handleConfirmRevert = useCallback(async () => {
        if (selectedVersion && id) {
            await revertItem(selectedVersion);
            confirmDialog.onFalse();
            setSelectedVersion(undefined);
            onClose();
        }
    }, [selectedVersion, revertItem, confirmDialog, id, onClose]);

    if (!id) return null;

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
                <DialogTitle>{t('history_title', { defaultValue: 'Tarix' })}</DialogTitle>

                <DialogContent sx={{ minHeight: 200, pb: 2, pt: 2, transition: 'all 0.3s ease-in-out' }}>
                    {isLoading ? (
                        <Box alignItems="center" display="flex" justifyContent="center" minHeight={200}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t('version')}</TableCell>
                                        <TableCell>{t('form.date')}</TableCell>
                                        <TableCell>{t('form.name')}</TableCell>
                                        <TableCell align="center">{t('form.quantity')}</TableCell>
                                        <TableCell align="center">{t('form.price')}</TableCell>
                                        <TableCell align="center">{t('table.actions')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {history.map((item: any, index: number) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <Box alignItems="center" display="flex" gap={1}>
                                                        v{item.version}
                                                        {index === 0 && (
                                                            <Chip color="primary" label={t('current_version', { defaultValue: 'Joriy versiya' })} size="small" />
                                                        )}
                                                        {item.deleted_at && (
                                                            <Chip color="error" label={t('deleted', { defaultValue: 'O\'chirilgan' })} size="small" />
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{fDate(item.date)}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell align="center">{getQuantityDisplay(item)}</TableCell>
                                                <TableCell align="center">{getPriceDisplay(item)}</TableCell>
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
