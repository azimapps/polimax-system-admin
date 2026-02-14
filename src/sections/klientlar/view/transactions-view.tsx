import type { GridColDef } from '@mui/x-data-grid';
import type { FinanceListItem, FinanceQueryParams } from 'src/types/finance';

import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useGetClient } from 'src/hooks/use-clients';
import { useGetFinances } from 'src/hooks/use-finance';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { Currency, FinanceType, PaymentMethod } from 'src/types/finance';

import { ClientTransactionHistoryDialog } from '../client-transaction-history-dialog';

// ----------------------------------------------------------------------

type Props = {
    clientId: number;
};

export function ClientTransactionsView({ clientId }: Props) {
    const { t } = useTranslate('client');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [financeType, setFinanceType] = useState<FinanceType | ''>('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
    const [currency, setCurrency] = useState<Currency | ''>('');

    const queryParams: FinanceQueryParams = {
        client_id: clientId,
        q: debouncedQuery || undefined,
        finance_type: financeType || undefined,
        payment_method: paymentMethod || undefined,
        currency: currency || undefined,
    };

    const { data: client } = useGetClient(clientId);
    const { data: finances = [], isLoading } = useGetFinances(queryParams);

    const historyDialog = useBoolean();
    const [historyFinanceId, setHistoryFinanceId] = useState<number>(0);

    // Calculate totals
    const totals = useMemo(() => {
        let kirimUzs = 0;
        let kirimUsd = 0;
        let chiqimUzs = 0;
        let chiqimUsd = 0;

        finances.forEach((finance) => {
            if (finance.finance_type === FinanceType.KIRIM) {
                if (finance.currency === Currency.UZS) {
                    kirimUzs += finance.value;
                } else {
                    kirimUsd += finance.value;
                }
            } else {
                if (finance.currency === Currency.UZS) {
                    chiqimUzs += finance.value;
                } else {
                    chiqimUsd += finance.value;
                }
            }
        });

        return { kirimUzs, kirimUsd, chiqimUzs, chiqimUsd };
    }, [finances]);

    const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        const timer = setTimeout(() => {
            setDebouncedQuery(event.target.value);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleHistory = useCallback(
        (id: number) => {
            setHistoryFinanceId(id);
            historyDialog.onTrue();
        },
        [historyDialog]
    );

    const handleClearFilters = useCallback(() => {
        setSearchQuery('');
        setDebouncedQuery('');
        setFinanceType('');
        setPaymentMethod('');
        setCurrency('');
    }, []);

    const hasFilters = searchQuery || financeType || paymentMethod || currency;

    const columns: GridColDef<FinanceListItem>[] = useMemo(
        () => [
            {
                field: 'finance_type',
                headerName: t('transaction.table.type'),
                width: 120,
                sortable: false,
                renderCell: (params) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%',
                            fontWeight: 'fontWeightSemiBold',
                            color: params.row.finance_type === FinanceType.KIRIM ? 'success.main' : 'error.main',
                        }}
                    >
                        {params.row.finance_type === FinanceType.KIRIM ? 'Kirim' : 'Chiqim'}
                    </Box>
                ),
            },
            {
                field: 'value',
                headerName: t('transaction.table.value'),
                width: 150,
                sortable: false,
                renderCell: (params) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%',
                            fontWeight: 'fontWeightSemiBold',
                        }}
                    >
                        {params.row.currency === Currency.USD ? '$' : ''}
                        {params.row.value.toLocaleString()}
                        {params.row.currency === Currency.UZS ? " so'm" : ''}
                    </Box>
                ),
            },
            {
                field: 'payment_method',
                headerName: t('transaction.table.payment_method'),
                width: 120,
                sortable: false,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        {params.row.payment_method === PaymentMethod.NAQD ? 'Naqd' : 'Bank'}
                    </Box>
                ),
            },
            {
                field: 'currency_exchange_rate',
                headerName: t('transaction.table.exchange_rate'),
                width: 150,
                sortable: false,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        {params.row.currency_exchange_rate
                            ? fCurrency(params.row.currency_exchange_rate)
                            : '-'}
                    </Box>
                ),
            },
            {
                field: 'date',
                headerName: t('transaction.table.date'),
                width: 180,
                sortable: false,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        {fDateTime(params.row.date)}
                    </Box>
                ),
            },
            {
                field: 'notes',
                headerName: t('transaction.table.notes'),
                flex: 1,
                minWidth: 200,
                sortable: false,
                renderCell: (params) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {params.row.notes || '-'}
                    </Box>
                ),
            },
            {
                field: 'actions',
                headerName: '',
                width: 60,
                sortable: false,
                align: 'right',
                headerAlign: 'right',
                renderCell: (params) => (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            width: 1,
                            alignItems: 'center',
                            height: '100%',
                        }}
                    >
                        <IconButton
                            onClick={(event) => {
                                event.stopPropagation();
                                handleHistory(params.row.id);
                            }}
                            title="Tarix"
                        >
                            <Iconify icon="solar:clock-circle-bold" />
                        </IconButton>
                    </Box>
                ),
            },
        ],
        [handleHistory, t]
    );

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
                sx={{ mb: 3 }}
            />

            {/* Summary Cards */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <Card sx={{ p: 3, flex: 1, borderRadius: 2, boxShadow: (theme) => theme.customShadows.card }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                Kirim (UZS)
                            </Typography>
                            <Typography variant="h4" sx={{ color: 'success.main' }}>
                                {fCurrency(totals.kirimUzs)}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                bgcolor: 'success.lighter',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Iconify icon="solar:import-bold" width={24} sx={{ color: 'success.main' }} />
                        </Box>
                    </Stack>
                </Card>

                <Card sx={{ p: 3, flex: 1, borderRadius: 2, boxShadow: (theme) => theme.customShadows.card }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                Kirim (USD)
                            </Typography>
                            <Typography variant="h4" sx={{ color: 'success.main' }}>
                                ${totals.kirimUsd.toLocaleString()}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                bgcolor: 'success.lighter',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Iconify icon="solar:import-bold" width={24} sx={{ color: 'success.main' }} />
                        </Box>
                    </Stack>
                </Card>

                <Card sx={{ p: 3, flex: 1, borderRadius: 2, boxShadow: (theme) => theme.customShadows.card }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                Chiqim (UZS)
                            </Typography>
                            <Typography variant="h4" sx={{ color: 'error.main' }}>
                                {fCurrency(totals.chiqimUzs)}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                bgcolor: 'error.lighter',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Iconify icon="solar:export-bold" width={24} sx={{ color: 'error.main' }} />
                        </Box>
                    </Stack>
                </Card>

                <Card sx={{ p: 3, flex: 1, borderRadius: 2, boxShadow: (theme) => theme.customShadows.card }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                Chiqim (USD)
                            </Typography>
                            <Typography variant="h4" sx={{ color: 'error.main' }}>
                                ${totals.chiqimUsd.toLocaleString()}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                bgcolor: 'error.lighter',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Iconify icon="solar:export-bold" width={24} sx={{ color: 'error.main' }} />
                        </Box>
                    </Stack>
                </Card>
            </Stack>

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
                        select
                        label="Turi"
                        value={financeType}
                        onChange={(e) => setFinanceType(e.target.value as FinanceType | '')}
                        sx={{ width: 150 }}
                    >
                        <MenuItem value="">Barchasi</MenuItem>
                        <MenuItem value={FinanceType.KIRIM}>Kirim</MenuItem>
                        <MenuItem value={FinanceType.CHIQIM}>Chiqim</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="To'lov usuli"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod | '')}
                        sx={{ width: 150 }}
                    >
                        <MenuItem value="">Barchasi</MenuItem>
                        <MenuItem value={PaymentMethod.NAQD}>Naqd</MenuItem>
                        <MenuItem value={PaymentMethod.BANK}>Bank</MenuItem>
                    </TextField>
                    <TextField
                        select
                        label="Valyuta"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as Currency | '')}
                        sx={{ width: 150 }}
                    >
                        <MenuItem value="">Barchasi</MenuItem>
                        <MenuItem value={Currency.UZS}>UZS</MenuItem>
                        <MenuItem value={Currency.USD}>USD</MenuItem>
                    </TextField>
                    {hasFilters && (
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={handleClearFilters}
                        >
                            {t('transaction.clear_filters')}
                        </Button>
                    )}
                </Box>

                <DataGrid
                    columns={columns}
                    disableColumnMenu
                    disableRowSelectionOnClick
                    loading={isLoading}
                    rows={finances}
                    pageSizeOptions={[10, 25, 50]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10 },
                        },
                    }}
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-cell:focus': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-columnSeparator': {
                            display: 'none',
                        },
                        '& .MuiDataGrid-columnHeader': {
                            bgcolor: 'background.neutral',
                            color: 'text.secondary',
                            fontWeight: 'fontWeightSemiBold',
                            textTransform: 'uppercase',
                            fontSize: 12,
                        },
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 600,
                        },
                        '& .MuiDataGrid-row:hover': {
                            bgcolor: 'action.hover',
                        },
                        height: finances.length > 0 ? 'auto' : 400,
                    }}
                />
            </Card>

            <ClientTransactionHistoryDialog
                open={historyDialog.value}
                onClose={historyDialog.onFalse}
                clientId={clientId}
                transactionId={historyFinanceId}
            />
        </Container>
    );
}
