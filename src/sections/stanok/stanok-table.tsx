
import type { Stanok } from 'src/types/stanok';
import type { GridColDef } from '@mui/x-data-grid';

import { memo, useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import { DataGrid } from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { FlagIcon } from 'src/components/flag-icon';

// ----------------------------------------------------------------------

type Props = {
    stanokList: Stanok[];
    loading: boolean;
    onHistory: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
};

function StanokTableComponent({ stanokList, loading, onHistory, onEdit, onDelete }: Props) {
    const { t } = useTranslate('stanok');
    const router = useRouter();

    // Menu state
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

    const handleOpenMenu = useCallback((event: React.MouseEvent<HTMLElement>, id: number) => {
        event.stopPropagation();
        setMenuAnchor(event.currentTarget);
        setSelectedRowId(id);
    }, []);

    const handleCloseMenu = useCallback(() => {
        setMenuAnchor(null);
        setSelectedRowId(null);
    }, []);

    const handleEdit = useCallback(() => {
        if (selectedRowId) {
            onEdit(selectedRowId);
            handleCloseMenu();
        }
    }, [selectedRowId, onEdit, handleCloseMenu]);

    const handleDelete = useCallback(() => {
        if (selectedRowId) {
            onDelete(selectedRowId);
            handleCloseMenu();
        }
    }, [selectedRowId, onDelete, handleCloseMenu]);

    const handleBrigades = useCallback(() => {
        if (selectedRowId) {
            router.push(paths.dashboard.stanoklar.brigades(selectedRowId));
            handleCloseMenu();
        }
    }, [selectedRowId, router, handleCloseMenu]);

    const handleProducts = useCallback(() => {
        if (selectedRowId) {
            router.push(paths.dashboard.stanoklar.products(selectedRowId));
            handleCloseMenu();
        }
    }, [selectedRowId, router, handleCloseMenu]);


    const columns: GridColDef<Stanok>[] = useMemo(
        () => [
            {
                field: 'country_code',
                headerName: t('table.country_code'),
                width: 100,
                sortable: false,
                renderCell: (params) => (
                    <Box display="flex" alignItems="center" height="100%">
                        <FlagIcon code={params.value} />
                    </Box>
                ),
            },
            {
                field: 'name',
                headerName: t('table.name'),
                flex: 1,
                minWidth: 200,
                sortable: false,
            },
            {
                field: 'actions',
                headerName: t('table.actions'),
                width: 100,
                sortable: false,
                align: 'right',
                headerAlign: 'right',
                renderCell: (params) => (
                    <IconButton
                        onClick={(event) => handleOpenMenu(event, params.row.id)}
                    >
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                ),
            },
        ],
        [t, handleOpenMenu]
    );

    return (
        <>
            <DataGrid
                columns={columns}
                disableColumnMenu
                disableRowSelectionOnClick
                loading={loading}
                rows={stanokList}
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
                    height: stanokList.length > 0 ? 'auto' : 400,
                }}
            />

            <Menu
                open={Boolean(menuAnchor)}
                anchorEl={menuAnchor}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                    paper: {
                        sx: {
                            width: 240,
                            '& .MuiMenuItem-root': {
                                px: 1,
                                typography: 'body2',
                                borderRadius: 0.75,
                            },
                        },
                    },
                }}
            >
                <MenuItem onClick={handleBrigades}>
                    <ListItemIcon>
                        <Iconify icon="solar:users-group-rounded-bold" />
                    </ListItemIcon>
                    <ListItemText primary={t('actions_menu.brigades')} />
                </MenuItem>

                <MenuItem onClick={handleProducts}>
                    <ListItemIcon>
                        <Iconify icon="solar:inbox-bold" />
                    </ListItemIcon>
                    <ListItemText primary={t('actions_menu.products')} />
                </MenuItem>

                <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                        <Iconify icon="solar:pen-bold" />
                    </ListItemIcon>
                    <ListItemText primary={t('actions_menu.edit')} />
                </MenuItem>

                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <Iconify icon="solar:trash-bin-trash-bold" color="error.main" />
                    </ListItemIcon>
                    <ListItemText primary={t('actions_menu.delete')} />
                </MenuItem>
            </Menu>
        </>
    );
}

export const StanokTable = memo(StanokTableComponent);
