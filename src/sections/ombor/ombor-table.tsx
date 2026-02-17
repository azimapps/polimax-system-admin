import type { OmborItem } from 'src/types/ombor';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom, TableNoData, TableSkeleton } from 'src/components/table';

import { OmborType } from 'src/types/ombor';

// ----------------------------------------------------------------------

type Props = {
    items: OmborItem[];
    loading: boolean;
    onHistory: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
};

export function OmborTable({ items, loading, onHistory, onEdit, onDelete }: Props) {
    const { t } = useTranslate('ombor');

    const TABLE_HEAD: { id: string; label: string; align?: 'left' | 'center' | 'right' }[] = [
        { id: 'ombor_type', label: t('form.ombor_type') },
        { id: 'name', label: t('form.name') },
        { id: 'quantity', label: t('form.quantity'), align: 'center' },
        { id: 'price', label: t('form.price'), align: 'center' },
        { id: 'date', label: t('form.date') },
        { id: 'actions', label: '', align: 'right' },
    ];

    const getQuantityDisplay = (item: OmborItem) => {
        if (item.ombor_type === OmborType.PLYONKA || item.ombor_type === OmborType.KRASKA) {
            return `${item.total_kg || 0} kg`;
        }
        if (item.ombor_type === OmborType.RASTVARITEL || item.ombor_type === OmborType.SUYUQ_KRASKA) {
            return `${item.total_liter || 0} L`;
        }
        if (item.ombor_type === OmborType.SILINDIR) {
            return `${item.quantity || 0} dona`;
        }
        return `${item.quantity || item.total_kg || 0}`;
    };

    const getPriceDisplay = (item: OmborItem) => {
        const price = item.price || (item.price_per_kg ? (item.price_per_kg * (item.total_kg || 0)) : 0);
        return `${fCurrency(price)} ${item.price_currency.toUpperCase()}`;
    };

    return (
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
                <Table size="medium" sx={{ minWidth: 800 }}>
                    <TableHeadCustom headCells={TABLE_HEAD} />

                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableSkeleton key={index} />
                            ))
                        ) : (
                            items.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell>
                                        <Box sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                            {t(`form.types.${row.ombor_type}`)}
                                        </Box>
                                    </TableCell>

                                    <TableCell>
                                        <Box sx={{ fontWeight: 500 }}>{row.name}</Box>
                                        {row.description && (
                                            <Box sx={{ color: 'text.secondary', typography: 'caption' }}>
                                                {row.description}
                                            </Box>
                                        )}
                                    </TableCell>

                                    <TableCell align="center">
                                        {getQuantityDisplay(row)}
                                    </TableCell>

                                    <TableCell align="center">
                                        {getPriceDisplay(row)}
                                    </TableCell>

                                    <TableCell>
                                        {fDate(row.date)}
                                    </TableCell>

                                    <TableCell align="right">
                                        <IconButton onClick={() => onHistory(row.id)}>
                                            <Iconify icon="solar:clock-circle-bold" />
                                        </IconButton>

                                        <IconButton onClick={() => onEdit(row.id)}>
                                            <Iconify icon="solar:pen-bold" />
                                        </IconButton>

                                        <IconButton color="error" onClick={() => onDelete(row.id)}>
                                            <Iconify icon="solar:trash-bin-trash-bold" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}

                        <TableNoData notFound={!loading && items.length === 0} />
                    </TableBody>
                </Table>
            </Scrollbar>
        </TableContainer>
    );
}
