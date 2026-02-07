import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useRestorePartner, useGetArchivedPartners } from 'src/hooks/use-partners';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PartnerTableArchived } from '../partner-table-archived';

// ----------------------------------------------------------------------

export function PartnerArchivedView() {
    const { t } = useTranslate('partner');

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const { data: partners = [], isLoading } = useGetArchivedPartners(debouncedQuery);
    const { mutateAsync: restorePartner } = useRestorePartner();

    const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        const timer = setTimeout(() => {
            setDebouncedQuery(event.target.value);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const confirmDialog = useBoolean();
    const [selectedId, setSelectedId] = useState<number | undefined>();

    const handleRestoreClick = useCallback(
        (id: number) => {
            setSelectedId(id);
            confirmDialog.onTrue();
        },
        [confirmDialog]
    );

    const handleConfirmRestore = useCallback(async () => {
        if (selectedId) {
            await restorePartner(selectedId);
            confirmDialog.onFalse();
            setSelectedId(undefined);
        }
    }, [selectedId, restorePartner, confirmDialog]);

    return (
        <Container maxWidth="xl">
            <CustomBreadcrumbs
                heading={t('archive')}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: t('list_title'), href: paths.dashboard.partners.list },
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

                <PartnerTableArchived
                    partners={partners}
                    loading={isLoading}
                    onRestore={handleRestoreClick}
                />
            </Card>

            <ConfirmDialog
                open={confirmDialog.value}
                onClose={confirmDialog.onFalse}
                title={t('restore_confirm_title')}
                content={t('restore_confirm_message')}
                action={
                    <Button variant="contained" color="success" onClick={handleConfirmRestore}>
                        {t('restore_confirm_button')}
                    </Button>
                }
            />
        </Container>
    );
}
