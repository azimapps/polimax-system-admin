import type { OrderListItem } from 'src/types/order';

import { memo } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData, TableSkeleton, TableHeadCustom } from 'src/components/table';

// ----------------------------------------------------------------------

type Props = {
    orders: OrderListItem[];
    loading: boolean;
    onHistory: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
};

function OrderTableComponent({ orders, loading, onHistory, onEdit, onDelete }: Props) {
    const { t } = useTranslate('order');

    const TABLE_HEAD: { id: string; label: string; align?: 'left' | 'center' | 'right'; sx?: any }[] = [
        { id: 'order_number', label: t('form.order_number') },
        { id: 'date', label: t('form.date') },
        { id: 'title', label: t('form.title') },
        { id: 'client_id', label: t('form.client') },
        { id: 'quantity_kg', label: t('form.quantity_kg'), align: 'center' },
        { id: 'material', label: t('form.material') },
        { id: 'sub_material', label: t('form.sub_material') },
        { id: 'film_thickness', label: t('form.film_thickness') },
        { id: 'film_width', label: t('form.film_width') },
        { id: 'cylinder_length', label: t('form.cylinder_length') },
        { id: 'cylinder_count', label: t('form.cylinder_count'), align: 'center' },
        { id: 'cylinder_aylanasi', label: t('form.cylinder_aylanasi') },
        { id: 'start_date', label: t('form.start_date') },
        { id: 'end_date', label: t('form.end_date') },
        { id: 'price_per_kg', label: t('form.price_per_kg') },
        { id: 'price_currency', label: t('form.price_currency'), align: 'center' },
        { id: 'manager_id', label: t('form.manager') },
        { id: 'status', label: t('form.status'), align: 'center' },
        {
            id: 'actions',
            label: '',
            align: 'right',
            sx: {
                position: 'sticky',
                right: 0,
                backgroundColor: 'background.neutral',
                zIndex: 1,
                boxShadow: (theme: any) => `-10px 0 20px -10px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.1)'}`,
                borderLeft: (theme: any) => `1px solid ${theme.palette.divider}`,
            }
        },
    ];

    const getClientName = (row: any) => row.client?.name || row.client_id || '-';
    const getManagerName = (row: any) => row.manager?.fullname || row.manager_id || '-';

    return (
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
                <Table size="medium" sx={{ minWidth: 2400 }}>
                    <TableHeadCustom headCells={TABLE_HEAD} />

                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableSkeleton key={index} />
                            ))
                        ) : (
                            orders.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                        {row.order_number}
                                    </TableCell>

                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                        {fDate(row.date)}
                                    </TableCell>

                                    <TableCell sx={{ minWidth: 200, whiteSpace: 'nowrap' }}>
                                        <Box sx={{ fontWeight: 500 }}>{row.title}</Box>
                                    </TableCell>

                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                        {getClientName(row)}
                                    </TableCell>

                                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                        {row.quantity_kg || 0}
                                    </TableCell>

                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                        <Label variant="soft" color="info">
                                            {row.material?.toUpperCase() || '-'}
                                        </Label>
                                    </TableCell>

                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                        {row.sub_material ? t(`form.sub_material_options.${row.sub_material}`) : '-'}
                                    </TableCell>

                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                        {row.film_thickness || '-'}
                                    </TableCell>

                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                        {row.film_width || '-'}
                                    </TableCell>

                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                        {row.cylinder_length || '-'}
                                    </TableCell>

                                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                        {row.cylinder_count || 0}
                                    </TableCell>

                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                        {row.cylinder_aylanasi || '-'}
                                    </TableCell>

                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                        {row.start_date ? fDate(row.start_date) : '-'}
                                    </TableCell>

                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                        {row.end_date ? fDate(row.end_date) : '-'}
                                    </TableCell>

                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                        {row.price_per_kg || 0}
                                    </TableCell>

                                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                        {row.price_currency?.toUpperCase() || '-'}
                                    </TableCell>

                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                        {getManagerName(row)}
                                    </TableCell>

                                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                        <Label
                                            variant="soft"
                                            color={(row.status === 'finished' && 'success') || 'warning'}
                                        >
                                            {t(`form.status_options.${row.status}`)}
                                        </Label>
                                    </TableCell>

                                    <TableCell
                                        align="right"
                                        sx={{
                                            position: 'sticky',
                                            right: 0,
                                            backgroundColor: 'background.paper',
                                            boxShadow: (theme) => `-10px 0 20px -10px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.1)'}`,
                                            borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        <Tooltip title={t('details')} arrow>
                                            <IconButton onClick={() => onHistory(row.id)}>
                                                <Iconify icon="solar:clock-circle-bold" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title={t('edit_item')} arrow>
                                            <IconButton onClick={() => onEdit(row.id)}>
                                                <Iconify icon="solar:pen-bold" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title={t('delete_item')} arrow>
                                            <IconButton color="error" onClick={() => onDelete(row.id)}>
                                                <Iconify icon="solar:trash-bin-trash-bold" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}

                        <TableNoData notFound={!loading && orders.length === 0} />
                    </TableBody>
                </Table>
            </Scrollbar>
        </TableContainer>
    );
}

export const OrderTable = memo(OrderTableComponent);
