import type { GridColDef } from '@mui/x-data-grid';
import type { LeadListItem } from 'src/types/lead';

import { memo, useMemo } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';

import { fPhoneNumber } from 'src/utils/format-phone';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import type { LeadDialogType } from './view/crm-view';

// ----------------------------------------------------------------------

type Props = {
    leads: LeadListItem[];
    loading: boolean;
    onOpen: (type: LeadDialogType, id: number) => void;
};

function LeadTableComponent({ leads, loading, onOpen }: Props) {
    const { t } = useTranslate('lead');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'qiziqishi_bor':
                return 'primary';
            case 'juda_qiziqdi':
                return 'success';
            case 'yangi':
                return 'info';
            case 'rad_etildi':
                return 'error';
            case 'mijozga_aylandi':
                return 'warning';
            default:
                return 'default';
        }
    };

    const columns: GridColDef<LeadListItem>[] = useMemo(
        () => [
            {
                field: 'fullname',
                headerName: t('table.fullname'),
                flex: 1,
                minWidth: 200,
                sortable: false,
                renderCell: (params) => (
                    <Box alignItems="center" display="flex">
                        <Avatar
                            alt={params.row.fullname}
                            sx={{ height: 32, width: 32, mr: 2 }}
                        >
                            {params.row.fullname?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        {params.row.fullname}
                    </Box>
                ),
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
                minWidth: 150,
                sortable: false,
                valueGetter: (params) => params || '-',
            },
            {
                field: 'status',
                headerName: t('table.status'),
                width: 120,
                sortable: false,
                renderCell: (params) => (
                    <Label variant="soft" color={getStatusColor(params.row.status)}>
                        {t(`status.${params.row.status}`)}
                    </Label>
                ),
            },
            {
                field: 'actions',
                headerName: t('table.actions'),
                width: 180,
                sortable: false,
                align: 'right',
                headerAlign: 'right',
                renderCell: (params) => (
                    <Box display="flex" justifyContent="flex-end" width="100%">
                        <Tooltip title={t('conversations')} arrow>
                            <IconButton
                                onMouseDown={(event) => {
                                    event.stopPropagation();
                                    onOpen('conversations', params.row.id);
                                }}
                            >
                                <Iconify icon="solar:chat-round-dots-bold" sx={{ pointerEvents: 'none' }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={t('history')} arrow>
                            <IconButton
                                onMouseDown={(event) => {
                                    event.stopPropagation();
                                    onOpen('history', params.row.id);
                                }}
                            >
                                <Iconify icon="solar:clock-circle-bold" sx={{ pointerEvents: 'none' }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={t('edit')} arrow>
                            <IconButton
                                onMouseDown={(event) => {
                                    event.stopPropagation();
                                    onOpen('edit', params.row.id);
                                }}
                            >
                                <Iconify icon="solar:pen-bold" sx={{ pointerEvents: 'none' }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={t('delete')} arrow>
                            <IconButton
                                color="error"
                                onMouseDown={(event) => {
                                    event.stopPropagation();
                                    onOpen('delete', params.row.id);
                                }}
                            >
                                <Iconify icon="solar:trash-bin-trash-bold" sx={{ pointerEvents: 'none' }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                ),
            },
        ],
        [onOpen, t]
    );

    return (
        <DataGrid
            columns={columns}
            disableColumnMenu
            disableRowSelectionOnClick
            loading={loading}
            rows={leads}
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
                '& .MuiDataGrid-cell:focus-within': {
                    outline: 'none',
                },
                height: leads.length > 0 ? 'auto' : 400,
            }}
        />
    );
}

export const LeadTable = memo(LeadTableComponent);
