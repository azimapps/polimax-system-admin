
import type { Stanok } from 'src/types/stanok';
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

import { useRestoreStanok, useGetArchivedStanoklar } from 'src/hooks/use-stanok';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export function StanokArchivedView() {
    const { t } = useTranslate('stanok');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const { data: stanokList = [], isLoading } = useGetArchivedStanoklar(debouncedQuery);
    const { mutateAsync: restoreStanok } = useRestoreStanok();

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
            await restoreStanok(restoreId);
            confirmDialog.onFalse();
            setRestoreId(undefined);
        }
    }, [restoreId, restoreStanok, confirmDialog]);

    const columns: GridColDef<Stanok>[] = [
        { field: 'name', headerName: t('table.name'), flex: 1, minWidth: 200 },
        { field: 'country_code', headerName: t('table.country_code'), width: 150 },
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
                    { name: t('list_title'), href: paths.dashboard.stanoklar.list },
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
                    rows={stanokList}
                    loading={isLoading}
                    disableColumnMenu
                    disableRowSelectionOnClick
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    sx={{ height: stanokList.length > 0 ? 'auto' : 400 }}
                />
            </Card>

            <ConfirmDialog
                open={confirmDialog.value}
                onClose={confirmDialog.onFalse}
                title={t('restore_confirm_title', { defaultValue: 'Restore Stanok' })}
                content={t('restore_confirm_message', { defaultValue: 'Are you sure you want to restore this stanok?' })}
                action={
                    <Button variant="contained" color="success" onClick={handleConfirmRestore}>
                        {t('restore', { defaultValue: 'Restore' })}
                    </Button>
                }
            />
        </Container>
    );
}
