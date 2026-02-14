import type { GridColDef } from '@mui/x-data-grid';
import type { ExpenseListItem } from 'src/types/expense';

import { memo, useMemo } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';

import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { ExpenseFrequency } from 'src/types/expense';

// ----------------------------------------------------------------------

type Props = {
    expenses: ExpenseListItem[];
    loading: boolean;
    onHistory: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
};

function ExpenseTableComponent({ expenses, loading, onHistory, onEdit, onDelete }: Props) {
    const { t } = useTranslate('expense');

    const columns: GridColDef<ExpenseListItem>[] = useMemo(
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
                            color: 'error.main',
                        }}
                    >
                        -{fCurrency(params.row.amount)}
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

export const ExpenseTable = memo(ExpenseTableComponent);
