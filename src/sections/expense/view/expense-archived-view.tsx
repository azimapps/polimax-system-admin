import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetArchivedExpenses, useRestoreExpense } from 'src/hooks/use-expense';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ArchivedExpenseTable } from '../expense-archived-table';

// ----------------------------------------------------------------------

export function ExpenseArchivedView() {
    const { t } = useTranslate('expense');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const { data: expenses = [], isLoading } = useGetArchivedExpenses(debouncedQuery || undefined);
    const { mutateAsync: restoreExpense } = useRestoreExpense();

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
            await restoreExpense(restoreId);
            confirmDialog.onFalse();
            setRestoreId(undefined);
        }
    }, [restoreId, restoreExpense, confirmDialog]);

    return (
        <Container maxWidth="xl">
            <CustomBreadcrumbs
                heading={t('archived_title')}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: t('expense'), href: paths.dashboard.expense.root },
                    { name: t('archive') },
                ]}
                action={
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                            href={paths.dashboard.expense.root}
                        >
                            {t('back_to_list')}
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
                                <Iconify
                                    icon="eva:search-fill"
                                    sx={{ color: 'text.disabled', mr: 1, width: 20, height: 20 }}
                                />
                            ),
                        }}
                    />
                </Box>

                <ArchivedExpenseTable
                    expenses={expenses}
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
