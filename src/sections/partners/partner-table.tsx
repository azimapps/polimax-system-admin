import type { GridColDef } from '@mui/x-data-grid';
import type { PartnerListItem } from 'src/types/partner';

import { memo, useMemo } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';

import { fPhoneNumber } from 'src/utils/format-phone';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
    partners: PartnerListItem[];
    loading: boolean;
    onHistory: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
};

function PartnerTableComponent({ partners, loading, onHistory, onEdit, onDelete }: Props) {
    const { t } = useTranslate('partner');

    const columns: GridColDef<PartnerListItem>[] = useMemo(
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
                renderCell: (params) => fPhoneNumber(params.row.phone_number),
            },
            {
                field: 'company',
                headerName: t('table.company'),
                flex: 1,
                minWidth: 200,
                sortable: false,
            },
            {
                field: 'categories',
                headerName: t('table.categories'),
                width: 250,
                sortable: false,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {params.row.categories.map((category) => (
                            <Chip key={category} label={category} size="small" variant="soft" />
                        ))}
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
            rows={partners}
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
                height: partners.length > 0 ? 'auto' : 400,
            }}
        />
    );
}

export const PartnerTable = memo(PartnerTableComponent);
