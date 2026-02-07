import type { GridColDef } from '@mui/x-data-grid';
import type { ClientListItem } from 'src/types/client';

import { useMemo } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
    clients: ClientListItem[];
    loading: boolean;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
};

export function KlientlarTable({ clients, loading, onView, onEdit, onDelete }: Props) {
    const { t } = useTranslate('client');
    const columns: GridColDef<ClientListItem>[] = useMemo(
        () => [
            {
                field: 'fullname',
                headerName: t('table.fullname'),
                flex: 1,
                minWidth: 200,
                sortable: false,
            },
            {
                field: 'phone_number',
                headerName: t('table.phone_number'),
                width: 150,
                sortable: false,
            },
            {
                field: 'company',
                headerName: t('table.company'),
                flex: 1,
                minWidth: 200,
                valueGetter: (params) => params || '-',
                sortable: false,
            },
            {
                field: 'actions',
                headerName: t('table.actions'),
                width: 150,
                sortable: false,
                renderCell: (params) => (
                    <>
                        <IconButton
                            size="small"
                            color="default"
                            onClick={() => onView(params.row.id)}
                        >
                            <Iconify icon="solar:eye-bold" />
                        </IconButton>
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onEdit(params.row.id)}
                        >
                            <Iconify icon="solar:pen-bold" />
                        </IconButton>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(params.row.id)}
                        >
                            <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                    </>
                ),
            },
        ],
        [t, onView, onEdit, onDelete]
    );

    return (
        <DataGrid
            rows={clients}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
                pagination: {
                    paginationModel: { pageSize: 25 },
                },
            }}
            disableRowSelectionOnClick
            sx={{ border: 0 }}
        />
    );
}
