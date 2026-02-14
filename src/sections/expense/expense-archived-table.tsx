import type { GridColDef } from '@mui/x-data-grid';
import type { ArchivedExpenseListItem } from 'src/types/expense';

import { memo, useMemo } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { ExpenseFrequency } from 'src/types/expense';

// ----------------------------------------------------------------------

type Props = {
    expenses: ArchivedExpenseListItem[];
    loading: boolean;
    onRestore: (id: number) => void;
};

function ArchivedExpenseTableComponent({ expenses, loading, onRestore }: Props) {
    const { t } = useTranslate('expense');

    const columns: GridColDef<ArchivedExpenseListItem>[] = useMemo(
        () => [
            {
                field: 'category',
                headerName: t('table.category'),
                width: 150,
                sortable: false,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <Chip
                            label={t(`form.categories.${params.row.category}`)}
                            size="small"
                            variant="soft"
                            color="primary"
                        />
                    </Box>
                ),
            },
            {
                field: 'frequency',
                headerName: t('table.frequency'),
                width: 140,
                sortable: false,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <Chip
                            label={t(`form.frequencies.${params.row.frequency}`)}
                            size="small"
                            variant="outlined"
                            color={params.row.frequency === ExpenseFrequency.RECURRING ? 'info' : 'default'}
                        />
                    </Box>
                ),
            },
            {
                field: 'amount',
                headerName: t('table.amount'),
                width: 180,
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
                        {fCurrency(params.row.amount)}
                    </Box>
                ),
            },
            {
                field: 'deleted_at',
                headerName: t('table.deleted_at'),
                width: 180,
                sortable: false,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        {fDateTime(params.row.deleted_at)}
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
                width: 100,
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
                            color="primary"
                            onClick={(event) => {
                                event.stopPropagation();
                                onRestore(params.row.id);
                            }}
                        >
                            <Iconify icon="solar:restart-bold" />
                        </IconButton>
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
            rows={expenses}
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
                height: expenses.length > 0 ? 'auto' : 400,
            }}
        />
    );
}

export const ArchivedExpenseTable = memo(ArchivedExpenseTableComponent);
