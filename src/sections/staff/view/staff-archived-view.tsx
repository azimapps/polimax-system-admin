
import type { Staff } from 'src/types/staff';
import type { GridColDef } from '@mui/x-data-grid';

import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';

import { useRestoreStaff, useGetArchivedStaff } from 'src/hooks/use-staff';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export function StaffArchivedView() {
    const { t } = useTranslate('staff');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const { data: staffList = [], isLoading } = useGetArchivedStaff(debouncedQuery);
    const { mutateAsync: restoreStaff } = useRestoreStaff();

    const confirmDialog = useBoolean();
    const [restoreId, setRestoreId] = useState<number | undefined>();

    const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        const timer = setTimeout(() => {
            setDebouncedQuery(event.target.value);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleRestoreClick = useCallback(
        (id: number) => {
            setRestoreId(id);
            confirmDialog.onTrue();
        },
        [confirmDialog]
    );

    const handleConfirmRestore = useCallback(async () => {
        if (restoreId) {
            await restoreStaff(restoreId);
            confirmDialog.onFalse();
            setRestoreId(undefined);
        }
    }, [restoreId, restoreStaff, confirmDialog]);

    const columns: GridColDef<Staff>[] = [
        {
            field: 'avatar_url',
            headerName: t('table.avatar'),
            width: 80,
            renderCell: (params) => (
                <Box
                    component="img"
                    src={params.value || '/assets/images/avatar/avatar_placeholder.svg'}
                    sx={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                />
            ),
        },
        { field: 'fullname', headerName: t('table.fullname'), flex: 1, minWidth: 200 },
        { field: 'phone_number', headerName: t('table.phone_number'), width: 150 },
        {
            field: 'type',
            headerName: t('table.type'),
            width: 120,
            renderCell: (params) => <Label>{t(`type.${params.value}`)}</Label>,
        },
        {
            field: 'actions',
            headerName: t('table.actions'),
            width: 100,
            align: 'right',
            headerAlign: 'right',
            renderCell: (params) => (
                <IconButton color="success" onClick={() => handleRestoreClick(params.row.id)}>
                    <Iconify icon="solar:restart-bold" />
                </IconButton>
            ),
        },
    ];

    return (
        <Container maxWidth="xl">
            <CustomBreadcrumbs
                heading={t('archived')}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: t('list_title'), href: paths.dashboard.staff.list },
                    { name: t('archive') },
                ]}
                sx={{ mb: 3 }}
            />

            <Card>
                <Container sx={{ p: 2 }}>
                    <TextField
                        sx={{ maxWidth: 320 }}
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder={t('search_placeholder')}
                        InputProps={{
                            startAdornment: (
                                <Box component="span" sx={{ color: 'text.disabled', mr: 1, display: 'flex' }}>
                                    <Iconify icon="eva:search-fill" />
                                </Box>
                            ),
                        }}
                    />
                </Container>

                <DataGrid
                    columns={columns}
                    rows={staffList}
                    loading={isLoading}
                    disableColumnMenu
                    disableRowSelectionOnClick
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    sx={{ height: staffList.length > 0 ? 'auto' : 400 }}
                />
            </Card>

            <ConfirmDialog
                open={confirmDialog.value}
                onClose={confirmDialog.onFalse}
                title={t('restore_confirm_title', { defaultValue: 'Restore Staff' })}
                content={t('restore_confirm_message', { defaultValue: 'Are you sure you want to restore this staff member?' })}
                action={
                    <Button variant="contained" color="success" onClick={handleConfirmRestore}>
                        {t('restore', { defaultValue: 'Restore' })}
                    </Button>
                }
            />
        </Container>
    );
}
