import type { GridColDef } from '@mui/x-data-grid';
import type { FinanceListItem } from 'src/types/finance';

import { memo, useMemo } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { Currency, FinanceType } from 'src/types/finance';

// ----------------------------------------------------------------------

type Props = {
    finances: FinanceListItem[];
    loading: boolean;
    onHistory: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
};

function FinanceTableComponent({ finances, loading, onHistory, onEdit, onDelete }: Props) {
    const { t } = useTranslate('finance');

    const columns: GridColDef<FinanceListItem>[] = useMemo(
        () => [
            {
                field: 'finance_type',
                headerName: t('table.type'),
                width: 120,
                sortable: false,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <Chip
                            label={t(`form.types.${params.row.finance_type}`)}
                            color={params.row.finance_type === FinanceType.KIRIM ? 'success' : 'error'}
                            size="small"
                            variant="soft"
                        />
                    </Box>
                ),
            },
            {
                field: 'value',
                headerName: t('table.value'),
                width: 180,
                sortable: false,
                renderCell: (params) => {
                    const value = params.row.value;
                    const currency = params.row.currency;
                    const displayValue =
                        currency === Currency.UZS
                            ? fCurrency(value)
                            : `$${value.toLocaleString()}`;

                    return (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                height: '100%',
                                fontWeight: 'fontWeightSemiBold',
                                color:
                                    params.row.finance_type === FinanceType.KIRIM
                                        ? 'success.main'
                                        : 'error.main',
                            }}
                        >
                            {params.row.finance_type === FinanceType.KIRIM ? '+' : '-'}
                            {displayValue}
                        </Box>
                    );
                },
            },
            {
                field: 'currency',
                headerName: t('table.currency'),
                width: 100,
                sortable: false,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <Chip
                            label={params.row.currency.toUpperCase()}
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                ),
            },
            {
                field: 'currency_exchange_rate',
                headerName: t('table.exchange_rate'),
                width: 140,
                sortable: false,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        {params.row.currency_exchange_rate
                            ? fCurrency(params.row.currency_exchange_rate)
                            : '-'}
                    </Box>
                ),
            },
            {
                field: 'date',
                headerName: t('table.date'),
                width: 180,
                sortable: false,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        {fDateTime(params.row.date)}
                    </Box>
                ),
            },
            {
                field: 'notes',
                headerName: t('table.notes'),
                flex: 1,
                minWidth: 200,
                sortable: false,
                renderCell: (params) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {params.row.notes || '-'}
                    </Box>
                ),
            },
            {
                field: 'actions',
                headerName: t('table.actions'),
                width: 150,
                sortable: false,
                align: 'right',
                headerAlign: 'right',
                renderCell: (params) => (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            width: 1,
                            alignItems: 'center',
                            height: '100%',
                        }}
                    >
                        <IconButton
                            onClick={(event) => {
                                event.stopPropagation();
                                onHistory(params.row.id);
                            }}
                        >
                            <Iconify icon="solar:clock-circle-bold" />
                        </IconButton>
                        <IconButton
                            onClick={(event) => {
                                event.stopPropagation();
                                onEdit(params.row.id);
                            }}
                        >
                            <Iconify icon="solar:pen-bold" />
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={(event) => {
                                event.stopPropagation();
                                onDelete(params.row.id);
                            }}
                        >
                            <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
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
            rows={finances}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
                pagination: {
                    paginationModel: { pageSize: 10 },
                },
            }}
            sx={{
                border: 'none',
                '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                },
                '& .MuiDataGrid-columnSeparator': {
                    display: 'none',
                },
                '& .MuiDataGrid-columnHeader': {
                    bgcolor: 'background.neutral',
                    color: 'text.secondary',
                    fontWeight: 'fontWeightSemiBold',
                    textTransform: 'uppercase',
                    fontSize: 12,
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 600,
                },
                '& .MuiDataGrid-row:hover': {
                    bgcolor: 'action.hover',
                },
                height: finances.length > 0 ? 'auto' : 400,
            }}
        />
    );
}

export const FinanceTable = memo(FinanceTableComponent);
