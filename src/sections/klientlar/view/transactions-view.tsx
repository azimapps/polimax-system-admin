import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useGetClient } from 'src/hooks/use-clients';
import {
    useGetClientTransactions,
    useDeleteClientTransaction,
} from 'src/hooks/use-client-transactions';

import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ClientTransactionTable } from '../client-transaction-table';
import { ClientTransactionDialog } from '../client-transaction-dialog';
import { ClientTransactionHistoryDialog } from '../client-transaction-history-dialog';

// ----------------------------------------------------------------------

type Props = {
    clientId: number;
};

export function ClientTransactionsView({ clientId }: Props) {
    const { t } = useTranslate('client');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const queryParams = {
        q: debouncedQuery || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
    };

    const { data: client } = useGetClient(clientId);
    const { data: transactionsData, isLoading } = useGetClientTransactions(clientId, queryParams);
    const { mutateAsync: deleteTransaction } = useDeleteClientTransaction(clientId);

    const transactions = transactionsData?.items || [];
    const total = transactionsData?.total || 0;

    const dialog = useBoolean();
    const confirmDialog = useBoolean();
    const historyDialog = useBoolean();
    const [selectedId, setSelectedId] = useState<number | undefined>();
    const [deleteId, setDeleteId] = useState<number | undefined>();
    const [historyTransactionId, setHistoryTransactionId] = useState<number>(0);

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
            setHistoryTransactionId(id);
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
            await deleteTransaction(deleteId);
            confirmDialog.onFalse();
            setDeleteId(undefined);
        }
    }, [deleteId, deleteTransaction, confirmDialog]);

    return (
        <Container maxWidth="xl">
            <CustomBreadcrumbs
                heading={t('transaction.list_title')}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: t('clients'), href: paths.dashboard.klientlar.list },
                    { name: client?.fullname || '...', href: paths.dashboard.klientlar.detail(String(clientId)) },
                    { name: t('transaction.transactions') },
                ]}
                action={
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        onClick={handleCreate}
                    >
                        {t('transaction.new_transaction')}
                    </Button>
                }
                sx={{ mb: 3 }}
            />

            {/* Total Summary Card */}
            <Card sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: (theme) => theme.customShadows.card }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                            {t('transaction.total_label')}
                        </Typography>
                        <Typography variant="h3" sx={{ color: 'success.main' }}>
                            {fCurrency(total)}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            bgcolor: 'success.lighter',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Iconify icon="solar:wad-of-money-bold" width={32} sx={{ color: 'success.main' }} />
                    </Box>
                </Stack>
            </Card>

            <Card sx={{ borderRadius: 2, boxShadow: (theme) => theme.customShadows.card }}>
                <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        sx={{ maxWidth: 300 }}
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder={t('transaction.search_placeholder')}
                        InputProps={{
                            startAdornment: (
                                <Iconify
                                    icon="eva:search-fill"
                                    sx={{ color: 'text.disabled', mr: 1, width: 20, height: 20 }}
                                />
                            ),
                        }}
                    />
                    <TextField
                        type="date"
                        label={t('transaction.date_from')}
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 180 }}
                    />
                    <TextField
                        type="date"
                        label={t('transaction.date_to')}
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 180 }}
                    />
                    {(dateFrom || dateTo || searchQuery) && (
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => {
                                setSearchQuery('');
                                setDebouncedQuery('');
                                setDateFrom('');
                                setDateTo('');
                            }}
                        >
                            {t('transaction.clear_filters')}
                        </Button>
                    )}
                </Box>

                <ClientTransactionTable
                    transactions={transactions}
                    loading={isLoading}
                    onHistory={handleHistory}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            </Card>

            <ClientTransactionDialog
                open={dialog.value}
                onClose={dialog.onFalse}
                clientId={clientId}
                transactionId={selectedId}
            />

            <ConfirmDialog
                open={confirmDialog.value}
                onClose={confirmDialog.onFalse}
                title={t('transaction.delete_confirm_title')}
                content={t('transaction.delete_confirm_message')}
                action={
                    <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                        {t('transaction.delete_confirm_button')}
                    </Button>
                }
            />

            <ClientTransactionHistoryDialog
                open={historyDialog.value}
                onClose={historyDialog.onFalse}
                clientId={clientId}
                transactionId={historyTransactionId}
            />
        </Container>
    );
}
