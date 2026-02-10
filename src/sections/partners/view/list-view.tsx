import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetPartners, useDeletePartner } from 'src/hooks/use-partners';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PartnerTable } from '../partner-table';
import { PartnerDialog } from '../partner-dialog';
import { PartnerHistoryDialog } from '../partner-history-dialog';

// ----------------------------------------------------------------------

export function PartnerListView() {
    const { t } = useTranslate('partner');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const { data: partners = [], isLoading } = useGetPartners({ q: debouncedQuery });
    const { mutateAsync: deletePartner } = useDeletePartner();

    const dialog = useBoolean();
    const confirmDialog = useBoolean();
    const historyDialog = useBoolean();
    const [selectedId, setSelectedId] = useState<number | undefined>();
    const [deleteId, setDeleteId] = useState<number | undefined>();
    const [historyPartnerId, setHistoryPartnerId] = useState<number>(0);

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

    const handleHistory = useCallback(
        (id: number) => {
            setHistoryPartnerId(id);
            historyDialog.onTrue();
        },
        [historyDialog]
    );

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
            await deletePartner(deleteId);
            confirmDialog.onFalse();
            setDeleteId(undefined);
        }
    }, [deleteId, deletePartner, confirmDialog]);

    return (
        <Container maxWidth="xl">
            <CustomBreadcrumbs
                heading={t('list_title')}
                links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: t('list_title') }]}
                action={
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            startIcon={<Iconify icon="solar:inbox-bold" />}
                            href={paths.dashboard.partners.archived}
                        >
                            {t('archive')}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            onClick={handleCreate}
                        >
                            {t('new_partner')}
                        </Button>
                    </Stack>
                }
                sx={{ mb: 3 }}
            />

            <Card sx={{ borderRadius: 2, boxShadow: (theme) => theme.customShadows.card }}>
                <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center' }}>
                    <TextField
                        fullWidth
                        sx={{ maxWidth: 360 }}
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder={t('search_placeholder')}
                        InputProps={{
                            startAdornment: (
                                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', mr: 1, width: 20, height: 20 }} />
                            ),
                        }}
                    />
                </Box>

                <PartnerTable
                    partners={partners}
                    loading={isLoading}
                    onHistory={handleHistory}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            </Card>

            <PartnerDialog open={dialog.value} onClose={dialog.onFalse} id={selectedId} />

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

            <PartnerHistoryDialog
                open={historyDialog.value}
                onClose={historyDialog.onFalse}
                partnerId={historyPartnerId}
            />
        </Container>
    );
}
