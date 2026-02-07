import { useNavigate } from 'react-router';
import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetClients, useDeleteClient } from 'src/hooks/use-clients';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ClientDialog } from '../client-dialog';
import { KlientlarTable } from '../client-table';

// ----------------------------------------------------------------------

export function KlientlarListView() {
    const { t } = useTranslate('client');
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const { data: clients = [], isLoading } = useGetClients(debouncedQuery);
    const { mutateAsync: deleteClient } = useDeleteClient();

    const dialog = useBoolean();
    const [selectedId, setSelectedId] = useState<number | undefined>();

    const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        const timer = setTimeout(() => {
            setDebouncedQuery(event.target.value);
        }, 500);
        return () => clearTimeout(timer);
    }, []);



    const handleCreate = useCallback(() => {
        setSelectedId(undefined);
        dialog.onTrue();
    }, [dialog]);

    const handleView = useCallback(
        (id: number) => {
            navigate(paths.dashboard.klientlar.detail(String(id)));
        },
        [navigate]
    );

    const handleEdit = useCallback(
        (id: number) => {
            setSelectedId(id);
            dialog.onTrue();
        },
        [dialog]
    );

    const handleDelete = useCallback(
        async (id: number) => {
            await deleteClient(id);
        },
        [deleteClient]
    );

    return (
        <Container maxWidth="xl">
            <CustomBreadcrumbs
                heading={t('list_title')}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: t('list_title') },
                ]}
                action={
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        onClick={handleCreate}
                    >
                        {t('new_client')}
                    </Button>
                }
                sx={{ mb: 3 }}
            />

            <Card>
                <Container sx={{ p: 2 }}>
                    <TextField
                        fullWidth
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

                <KlientlarTable
                    clients={clients}
                    loading={isLoading}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </Card>

            <ClientDialog
                open={dialog.value}
                onClose={dialog.onFalse}
                id={selectedId}
            />
        </Container>
    );
}
