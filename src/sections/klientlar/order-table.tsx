
import type { GridColDef } from '@mui/x-data-grid';
import type { OrderListItem } from 'src/types/order';

import { memo, useMemo } from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

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

    const columns: GridColDef<OrderListItem>[] = useMemo(
        () => [
            {
                field: 'order_number',
                headerName: t('form.order_number'),
                width: 120,
            },
            {
                field: 'date',
                headerName: t('form.date'),
                width: 150,
                renderCell: (params) => fDate(params.row.date),
            },
            {
                field: 'title',
                headerName: t('form.title'),
                flex: 1,
                minWidth: 200,
            },
            {
                field: 'client_id',
                headerName: t('form.client'),
                width: 140,
                renderCell: (params) => (params.row as any).client?.name || params.row.client_id || '-',
            },
            {
                field: 'quantity_kg',
                headerName: t('form.quantity_kg'),
                width: 120,
            },
            {
                field: 'material',
                headerName: t('form.material'),
                width: 120,
                renderCell: (params) => (
                    <Label variant="soft" color="info">
                        {params.row.material?.toUpperCase() || '-'}
                    </Label>
                ),
            },
            {
                field: 'sub_material',
                headerName: t('form.sub_material'),
                width: 140,
                renderCell: (params) => params.row.sub_material ? t(`form.sub_material_options.${params.row.sub_material}`) : '-',
            },
            {
                field: 'film_thickness',
                headerName: t('form.film_thickness'),
                width: 130,
            },
            {
                field: 'film_width',
                headerName: t('form.film_width'),
                width: 130,
            },
            {
                field: 'cylinder_length',
                headerName: t('form.cylinder_length'),
                width: 140,
            },
            {
                field: 'cylinder_count',
                headerName: t('form.cylinder_count'),
                width: 120,
            },
            {
                field: 'cylinder_aylanasi',
                headerName: t('form.cylinder_aylanasi'),
                width: 140,
            },
            {
                field: 'start_date',
                headerName: t('form.start_date'),
                width: 150,
                renderCell: (params) => params.row.start_date ? fDate(params.row.start_date) : '-',
            },
            {
                field: 'end_date',
                headerName: t('form.end_date'),
                width: 150,
                renderCell: (params) => params.row.end_date ? fDate(params.row.end_date) : '-',
            },
            {
                field: 'price_per_kg',
                headerName: t('form.price_per_kg'),
                width: 120,
            },
            {
                field: 'price_currency',
                headerName: t('form.price_currency'),
                width: 100,
                renderCell: (params) => params.row.price_currency?.toUpperCase() || '-',
            },
            {
                field: 'manager_id',
                headerName: t('form.manager'),
                width: 150,
                renderCell: (params) => (params.row as any).manager?.fullname || params.row.manager_id || '-',
            },
            {
                field: 'status',
                headerName: t('form.status'),
                width: 120,
                renderCell: (params) => (
                    <Label
                        variant="soft"
                        color={(params.row.status === 'finished' && 'success') || 'warning'}
                    >
                        {t(`form.status_options.${params.row.status}`)}
                    </Label>
                ),
            },
            {
                field: 'actions',
                headerName: '',
                width: 140,
                sortable: false,
                align: 'right',
                headerAlign: 'right',
                renderCell: (params) => (
                    <Box display="flex" justifyContent="flex-end" width="100%">
                        <Tooltip title={t('details')} arrow>
                            <IconButton
                                onMouseDown={(event) => {
                                    event.stopPropagation();
                                    onHistory(params.row.id);
                                }}
                            >
                                <Iconify icon="solar:clock-circle-bold" sx={{ pointerEvents: 'none' }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={t('edit_item')} arrow>
                            <IconButton
                                onMouseDown={(event) => {
                                    event.stopPropagation();
                                    onEdit(params.row.id);
                                }}
                            >
                                <Iconify icon="solar:pen-bold" sx={{ pointerEvents: 'none' }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={t('delete_item')} arrow>
                            <IconButton
                                color="error"
                                onMouseDown={(event) => {
                                    event.stopPropagation();
                                    onDelete(params.row.id);
                                }}
                            >
                                <Iconify icon="solar:trash-bin-trash-bold" sx={{ pointerEvents: 'none' }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                ),
            },
        ],
        [onEdit, onDelete, onHistory, t]
    );

    return (
        <DataGrid
            columns={columns}
            disableColumnMenu
            disableRowSelectionOnClick
            loading={loading}
            rows={orders}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
                pagination: {
                    paginationModel: { pageSize: 10 },
                },
            }}
            sx={{
                '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                },
                '& .MuiDataGrid-cell:focus-within': {
                    outline: 'none',
                },
                height: orders.length > 0 ? 'auto' : 400,
            }}
        />
    );
}

export const OrderTable = memo(OrderTableComponent);
