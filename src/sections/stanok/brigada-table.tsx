
import type { GridColDef} from '@mui/x-data-grid';
import type { BrigadaListItem } from 'src/types/brigada';

import { useMemo } from 'react';

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
    brigadas: BrigadaListItem[];
    loading?: boolean;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onHistory: (id: number) => void;
    onMembers: (id: number) => void;
};

export function BrigadaTable({ brigadas, loading, onEdit, onDelete, onHistory, onMembers }: Props) {
    const { t } = useTranslate('stanok');

    const columns: GridColDef<BrigadaListItem>[] = useMemo(
        () => [
            {
                field: 'name',
                headerName: t('brigada.table.name'),
                flex: 1,
                minWidth: 200,
            },
            {
                field: 'leader',
                headerName: t('brigada.table.leader'),
                flex: 1,
                minWidth: 200,
            },
            {
                type: 'actions',
                field: 'actions',
                headerName: t('table.actions'),
                width: 140,
                getActions: (params) => [
                    <GridActionsCellItem
                        key="members"
                        icon={<Iconify icon="solar:users-group-rounded-bold" />}
                        label={t('brigada.members')}
                        onClick={() => onMembers(params.row.id)}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        key="history"
                        icon={<Iconify icon="solar:restart-bold" />}
                        label={t('history_title')}
                        onClick={() => onHistory(params.row.id)}
                        showInMenu
                    />,
                    <GridActionsCellItem
                        key="edit"
                        icon={<Iconify icon="solar:pen-bold" />}
                        label={t('update')}
                        onClick={() => onEdit(params.row.id)}
                        sx={{ color: 'primary.main' }}
                    />,
                    <GridActionsCellItem
                        key="delete"
                        icon={<Iconify icon="solar:trash-bin-trash-bold" />}
                        label={t('table.delete')}
                        onClick={() => onDelete(params.row.id)}
                        sx={{ color: 'error.main' }}
                    />,
                ],
            },
        ],
        [onDelete, onEdit, onHistory, onMembers, t]
    );

    return (
        <DataGrid
            rows={brigadas}
            columns={columns}
            loading={loading}
            autoHeight
            pagination
            initialState={{
                pagination: {
                    paginationModel: { pageSize: 10 },
                },
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
        />
    );
}
