
import type { Staff } from 'src/types/staff';
import type { GridColDef } from '@mui/x-data-grid';

import { memo, useMemo } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';

import { fPhoneNumber } from 'src/utils/format-phone';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
    staffList: Staff[];
    loading: boolean;
    onHistory: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
};

function StaffTableComponent({ staffList, loading, onHistory, onEdit, onDelete }: Props) {
    const { t } = useTranslate('staff');
    const columns: GridColDef<Staff>[] = useMemo(
        () => [
            {
                field: 'avatar_url',
                headerName: t('table.avatar'),
                width: 80,
                sortable: false,
                renderCell: (params) => (
                    <Box alignItems="center" display="flex" justifyContent="center">
                        <Avatar
                            alt={params.row.fullname}
                            src={params.row.avatar_url || undefined}
                            sx={{ height: 40, width: 40 }}
                        >
                            {params.row.fullname?.charAt(0)?.toUpperCase()}
                        </Avatar>
                    </Box>
                ),
            },
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
                renderCell: (params) => fPhoneNumber(params.row.phone_number),
            },
            {
                field: 'type',
                headerName: t('table.type'),
                width: 150,
                sortable: false,
                renderCell: (params) => (
                    <Label color="info">{t(`type.${params.row.type}`)}</Label>
                ),
            },
            {
                field: 'role_type',
                headerName: t('table.role'),
                width: 150,
                sortable: false,
                renderCell: (params) => {
                    const role = params.row.worker_type || params.row.accountant_type;
                    return role ? <Label color="warning">{t(`role.${role}`)}</Label> : '-';
                },
            },
            {
                field: 'actions',
                headerName: t('table.actions'),
                width: 150,
                sortable: false,
                align: 'right',
                headerAlign: 'right',
                renderCell: (params) => (
                    <Box display="flex" justifyContent="flex-end" width="100%">
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
            rows={staffList}
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
                height: staffList.length > 0 ? 'auto' : 400,
            }}
        />
    );
}

export const StaffTable = memo(StaffTableComponent);
