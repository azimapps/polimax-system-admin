import type { GridColDef } from '@mui/x-data-grid';
import type { OmborAccount } from 'src/types/ombor-account';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
    accounts: OmborAccount[];
    loading: boolean;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
};

export function OmborAccountTable({ accounts, loading, onEdit, onDelete }: Props) {
    const { t } = useTranslate('ombor');

    const columns: GridColDef<OmborAccount>[] = useMemo(
        () => [
            {
                field: 'login',
                headerName: t('table.login'),
                flex: 1,
                minWidth: 150,
            },
            {
                field: 'role',
                headerName: t('table.role'),
                width: 250,
                renderCell: (params) => (
                    <Label color="info">{t(`role_options.${params.row.role}`)}</Label>
                ),
            },
            {
                field: 'actions',
                headerName: t('table.actions'),
                width: 120,
                sortable: false,
                align: 'right',
                headerAlign: 'right',
                renderCell: (params) => (
                    <Box display="flex" justifyContent="flex-end" width="100%">
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
        [onEdit, onDelete, t]
    );

    return (
        <DataGrid
            columns={columns}
            disableColumnMenu
            disableRowSelectionOnClick
            loading={loading}
            rows={accounts}
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
                height: accounts.length > 0 ? 'auto' : 400,
            }}
        />
    );
}
