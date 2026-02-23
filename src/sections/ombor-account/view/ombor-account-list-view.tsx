import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetOmborAccounts, useDeleteOmborAccount } from 'src/hooks/use-ombor-account';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { OmborAccountTable } from '../ombor-account-table';
import { OmborAccountDialog } from '../ombor-account-dialog';

// ----------------------------------------------------------------------

export function OmborAccountListView() {
    const { t } = useTranslate('ombor');

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const { data: accounts = [], isLoading } = useGetOmborAccounts();
    const { mutateAsync: deleteAccount } = useDeleteOmborAccount();

    const dialog = useBoolean();
    const confirmDialog = useBoolean();

    const [selectedId, setSelectedId] = useState<number | undefined>();
    const [deleteId, setDeleteId] = useState<number | undefined>();

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

    const handleEdit = useCallback(
        (id: number) => {
            setSelectedId(id);
            dialog.onTrue();
        },
        [dialog]
    );

    const handleDeleteClick = useCallback(
        (id: number) => {
            setDeleteId(id);
            confirmDialog.onTrue();
        },
        [confirmDialog]
    );

    const handleConfirmDelete = useCallback(async () => {
        if (deleteId) {
            await deleteAccount(deleteId);
            confirmDialog.onFalse();
            setDeleteId(undefined);
        }
    }, [deleteId, deleteAccount, confirmDialog]);

    // Simple client-side search since we fetch all accounts
    const filteredAccounts = accounts.filter(acc =>
        acc.login.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        acc.role.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    return (
        <Container maxWidth="xl">
            <CustomBreadcrumbs
                heading={t('ombor_accounts_title')}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: t('list_title'), href: paths.dashboard.ombor.root },
                    { name: t('ombor_accounts_title') },
                ]}
                action={
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        onClick={handleCreate}
                    >
                        {t('new_account')}
                    </Button>
                }
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

                <OmborAccountTable
                    accounts={filteredAccounts}
                    loading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            </Card>

            <OmborAccountDialog
                open={dialog.value}
                onClose={dialog.onFalse}
                id={selectedId}
            />

            <ConfirmDialog
                open={confirmDialog.value}
                onClose={confirmDialog.onFalse}
                title={t('delete_confirm_title')}
                content={t('delete_confirm_message')}
                action={
                    <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                        {t('delete_confirm_button')}
                    </Button>
                }
            />
        </Container>
    );
}
