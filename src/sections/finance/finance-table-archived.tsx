import type { GridColDef } from '@mui/x-data-grid';
import type { FinanceListItem } from 'src/types/finance';

import { memo, useMemo } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { Currency, FinanceType, PaymentMethod } from 'src/types/finance';

// ----------------------------------------------------------------------

type Props = {
    finances: FinanceListItem[];
    loading: boolean;
    onRestore: (id: number) => void;
};

function FinanceTableArchivedComponent({ finances, loading, onRestore }: Props) {
    const { t } = useTranslate('finance');

    const columns: GridColDef<FinanceListItem>[] = useMemo(
        () => [
            {
                field: 'payment_method',
                headerName: t('table.payment_method'),
                width: 130,
                sortable: false,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <Chip
                            label={t(`form.methods.${params.row.payment_method}`)}
                            color={params.row.payment_method === PaymentMethod.NAQD ? 'info' : 'warning'}
                            size="small"
                            variant="soft"
                        />
                    </Box>
                ),
            },
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
                        <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            startIcon={<Iconify icon="solar:restart-bold" />}
                            onClick={(event) => {
                                event.stopPropagation();
                                onRestore(params.row.id);
                            }}
                        >
                            {t('restore')}
                        </Button>
                    </Box>
                ),
            },
        ],
        [onRestore, t]
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

export const FinanceTableArchived = memo(FinanceTableArchivedComponent);
