import type { GridColDef } from '@mui/x-data-grid';
import type { PartnerListItem } from 'src/types/partner';

import { memo, useMemo } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
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
                minWidth: 240,
                sortable: false,
                renderCell: (params) => (
                    <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            alt={params.row.fullname}
                            src={params.row.logo_url}
                            sx={{ width: 36, height: 36, border: (theme) => `solid 2px ${theme.vars.palette.background.neutral}` }}
                        >
                            {params.row.fullname.charAt(0).toUpperCase()}
                        </Avatar>
                        {params.row.fullname}
                    </Box>
                ),
            },
            {
                field: 'phone_number',
                headerName: t('table.phone_number'),
                width: 180,
                sortable: false,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        {fPhoneNumber(params.row.phone_number)}
                    </Box>
                ),
            },
            {
                field: 'company',
                headerName: t('table.company'),
                width: 200,
                sortable: false,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        {params.row.company}
                    </Box>
                ),
            },
            {
                field: 'categories',
                headerName: t('table.categories'),
                width: 220,
                sortable: false,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center', height: '100%' }}>
                        {params.row.categories.map((category) => (
                            <Chip key={category} label={t(`form.categories.${category}`)} size="small" variant="soft" />
                        ))}
                    </Box>
                ),
            },
            {
                field: 'image_urls',
                headerName: t('table.documents') || 'Hujjatlar',
                width: 180,
                sortable: false,
                renderCell: (params) => {
                    const urls = params.row.image_urls || [];
                    if (urls.length === 0) return null;

                    return (
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
                            {urls.map((url, index) => {
                                const isPdf = url.toLowerCase().includes('.pdf');
                                return (
                                    <Tooltip key={url} title={isPdf ? 'PDF' : 'Rasm'}>
                                        <Link
                                            href={url}
                                            target="_blank"
                                            rel="noopener"
                                            sx={{
                                                display: 'flex',
                                                color: isPdf ? 'error.main' : 'info.main',
                                                '&:hover': { opacity: 0.8 },
                                            }}
                                        >
                                            <Iconify
                                                icon={isPdf ? 'solar:file-text-bold' : 'solar:gallery-wide-bold'}
                                                width={24}
                                            />
                                        </Link>
                                    </Tooltip>
                                );
                            })}
                        </Box>
                    );
                },
            },
            {
                field: 'actions',
                headerName: t('table.actions'),
                width: 180,
                sortable: false,
                align: 'right',
                headerAlign: 'right',
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: 1, alignItems: 'center', height: '100%' }}>
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
                height: partners.length > 0 ? 'auto' : 400,
            }}
        />
    );
}

export const PartnerTable = memo(PartnerTableComponent);
