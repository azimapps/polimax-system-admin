import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useRestoreFinance, useGetArchivedFinances } from 'src/hooks/use-finance';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { FinanceTableArchived } from '../finance-table-archived';

// ----------------------------------------------------------------------

export function ArchivedView() {
    const { t } = useTranslate('finance');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const { data: finances = [], isLoading } = useGetArchivedFinances(debouncedQuery);
    const { mutateAsync: restoreFinance } = useRestoreFinance();

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
            await restoreFinance(restoreId);
            confirmDialog.onFalse();
            setRestoreId(undefined);
        }
    }, [restoreId, restoreFinance, confirmDialog]);

    return (
        <Container maxWidth="xl">
            <CustomBreadcrumbs
                heading={t('archived_title')}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: t('finance'), href: paths.dashboard.finance.cash },
                    { name: t('archive') },
                ]}
                action={
                    <Button
                        variant="outlined"
                        startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                        href={paths.dashboard.finance.cash}
                    >
                        {t('back_to_list')}
                    </Button>
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
                                <Iconify
                                    icon="eva:search-fill"
                                    sx={{ color: 'text.disabled', mr: 1, width: 20, height: 20 }}
                                />
                            ),
                        }}
                    />
                </Box>

                <FinanceTableArchived
                    finances={finances}
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
                    <Button variant="contained" color="primary" onClick={handleConfirmRestore}>
                        {t('restore')}
                    </Button>
                }
            />
        </Container>
    );
}
