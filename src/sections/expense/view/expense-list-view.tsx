import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetExpenses, useDeleteExpense } from 'src/hooks/use-expense';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ExpenseFrequency } from 'src/types/expense';

import { ExpenseTable } from '../expense-table';
import { ExpenseDialog } from '../expense-dialog';
import { ExpenseHistoryDialog } from '../expense-history-dialog';

// ----------------------------------------------------------------------

export function ExpenseListView() {
    const { t } = useTranslate('expense');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [currentTab, setCurrentTab] = useState<ExpenseFrequency | 'all'>('all');

    const queryParams = {
        q: debouncedQuery || undefined,
        frequency: currentTab !== 'all' ? currentTab : undefined,
    };

    const { data: expenses = [], isLoading } = useGetExpenses(queryParams);
    const { mutateAsync: deleteExpense } = useDeleteExpense();

    const dialog = useBoolean();
    const confirmDialog = useBoolean();
    const historyDialog = useBoolean();
    const [selectedId, setSelectedId] = useState<number | undefined>();
    const [deleteId, setDeleteId] = useState<number | undefined>();
    const [historyExpenseId, setHistoryExpenseId] = useState<number>(0);

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
            setHistoryExpenseId(id);
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
            await deleteExpense(deleteId);
            confirmDialog.onFalse();
            setDeleteId(undefined);
        }
    }, [deleteId, deleteExpense, confirmDialog]);

    const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: ExpenseFrequency | 'all') => {
        setCurrentTab(newValue);
    }, []);

    const TABS = [
        { value: 'all', label: t('tabs.all') },
        { value: ExpenseFrequency.RECURRING, label: t('tabs.recurring') },
        { value: ExpenseFrequency.ONE_TIME, label: t('tabs.one_time') },
    ];

    return (
        <Container maxWidth="xl">
            <CustomBreadcrumbs
                heading={t('expense_title')}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: t('expense'), href: paths.dashboard.expense.root },
                    { name: t('list') },
                ]}
                action={
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            startIcon={<Iconify icon="solar:inbox-bold" />}
                            href={paths.dashboard.expense.archived}
                        >
                            {t('archive')}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            onClick={handleCreate}
                        >
                            {t('new_expense')}
                        </Button>
                    </Stack>
                }
                sx={{ mb: 3 }}
            />

            <Card sx={{ borderRadius: 2, boxShadow: (theme) => theme.customShadows.card }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    sx={{
                        px: 2.5,
                        borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}`,
                    }}
                >
                    {TABS.map((tab) => (
                        <Tab key={tab.value} value={tab.value} label={tab.label} />
                    ))}
                </Tabs>

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

                <ExpenseTable
                    expenses={expenses}
                    loading={isLoading}
                    onHistory={handleHistory}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            </Card>

            <ExpenseDialog
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

            <ExpenseHistoryDialog
                open={historyDialog.value}
                onClose={historyDialog.onFalse}
                expenseId={historyExpenseId}
            />
        </Container>
    );
}
