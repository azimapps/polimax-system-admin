import type { GridColDef } from '@mui/x-data-grid';
import type { ClientTransactionListItem } from 'src/types/client-transaction';

import { memo, useMemo } from 'react';

import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
    transactions: ClientTransactionListItem[];
    loading: boolean;
    onHistory: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
};

function ClientTransactionTableComponent({
    transactions,
    loading,
    onHistory,
    onEdit,
    onDelete,
}: Props) {
    const { t } = useTranslate('client');

    const columns: GridColDef<ClientTransactionListItem>[] = useMemo(
        () => [
            {
                field: 'value',
                headerName: t('transaction.table.value'),
                width: 150,
                sortable: false,
                renderCell: (params) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%',
                            fontWeight: 'fontWeightSemiBold',
                        }}
                    >
                        ${params.row.value.toLocaleString()}
                    </Box>
                ),
            },
            {
                field: 'currency_exchange_rate',
                headerName: t('transaction.table.exchange_rate'),
                width: 180,
                sortable: false,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        {fCurrency(params.row.currency_exchange_rate)}
                    </Box>
                ),
            },
            {
                field: 'total_uzs',
                headerName: t('transaction.table.total_uzs'),
                width: 200,
                sortable: false,
                renderCell: (params) => {
                    const totalUzs = params.row.value * params.row.currency_exchange_rate;
                    return (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                height: '100%',
                                fontWeight: 'fontWeightSemiBold',
                                color: 'success.main',
                            }}
                        >
                            {fCurrency(totalUzs)}
                        </Box>
                    );
                },
            },
            {
                field: 'date',
                headerName: t('transaction.table.date'),
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
                headerName: t('transaction.table.notes'),
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
                headerName: t('transaction.table.actions'),
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
            rows={transactions}
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
                height: transactions.length > 0 ? 'auto' : 400,
            }}
        />
    );
}

export const ClientTransactionTable = memo(ClientTransactionTableComponent);
