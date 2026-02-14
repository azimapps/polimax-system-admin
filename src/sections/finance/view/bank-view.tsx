import type { FinanceListItem } from 'src/types/finance';

import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useGetFinances, useDeleteFinance } from 'src/hooks/use-finance';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { Currency, FinanceType, PaymentMethod } from 'src/types/finance';

import { FinanceDialog } from '../finance-dialog';
import { FinanceHistoryDialog } from '../finance-history-dialog';

// ----------------------------------------------------------------------

type GroupedFinances = {
    date: string;
    items: FinanceListItem[];
};

function groupFinancesByDate(finances: FinanceListItem[]): GroupedFinances[] {
    const groups: Record<string, FinanceListItem[]> = {};

    finances.forEach((finance) => {
        const dateKey = finance.date.split('T')[0];
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(finance);
    });

    return Object.entries(groups)
        .map(([date, items]) => ({ date, items }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function calculateBalances(finances: FinanceListItem[], currency: Currency) {
    let total = 0;
    finances.forEach((f) => {
        if (f.currency === currency) {
            if (f.finance_type === FinanceType.KIRIM) {
                total += f.value;
            } else {
                total -= f.value;
            }
        }
    });
    return total;
}

// ----------------------------------------------------------------------

export function BankView() {
    const { t } = useTranslate('finance');
    const [currentTab, setCurrentTab] = useState<FinanceType | 'all'>('all');

    // Date range state
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const [startDate, setStartDate] = useState(firstDayOfMonth.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

    const queryParams = {
        payment_method: PaymentMethod.BANK,
        finance_type: currentTab !== 'all' ? currentTab : undefined,
    };

    const { data: finances = [], isLoading } = useGetFinances(queryParams);
    const { mutateAsync: deleteFinance } = useDeleteFinance();

    const dialog = useBoolean();
    const confirmDialog = useBoolean();
    const historyDialog = useBoolean();
    const [selectedId, setSelectedId] = useState<number | undefined>();
    const [deleteId, setDeleteId] = useState<number | undefined>();
    const [historyFinanceId, setHistoryFinanceId] = useState<number>(0);

    // Filter finances by date range
    const filteredFinances = useMemo(() =>
        finances.filter((f) => {
            const financeDate = f.date.split('T')[0];
            return financeDate >= startDate && financeDate <= endDate;
        })
    , [finances, startDate, endDate]);

    // Group finances by date
    const groupedFinances = useMemo(() => groupFinancesByDate(filteredFinances), [filteredFinances]);

    // Calculate balances
    const periodNetUZS = useMemo(() => calculateBalances(filteredFinances, Currency.UZS), [filteredFinances]);
    const periodNetUSD = useMemo(() => calculateBalances(filteredFinances, Currency.USD), [filteredFinances]);

    const handleCreate = useCallback(() => {
        setSelectedId(undefined);
        dialog.onTrue();
    }, [dialog]);

    const handleHistory = useCallback(
        (id: number) => {
            setHistoryFinanceId(id);
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
            await deleteFinance(deleteId);
            confirmDialog.onFalse();
            setDeleteId(undefined);
        }
    }, [deleteId, deleteFinance, confirmDialog]);

    const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: FinanceType | 'all') => {
        setCurrentTab(newValue);
    }, []);

    const TABS = [
        { value: 'all', label: t('tabs.all') },
        { value: FinanceType.KIRIM, label: t('tabs.kirim') },
        { value: FinanceType.CHIQIM, label: t('tabs.chiqim') },
    ];

    return (
        <Container maxWidth="xl">
            {/* Header with title and date range */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Typography variant="h4">{t('bank_title')}</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="solar:calendar-date-bold" sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {fDate(startDate)} - {fDate(endDate)}
                    </Typography>
                </Stack>
            </Stack>

            {/* Date range picker */}
            <Card sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                            bgcolor: 'background.neutral',
                            borderRadius: 1,
                            px: 2,
                            py: 1,
                        }}
                    >
                        <Iconify icon="solar:calendar-date-bold" sx={{ color: 'primary.main' }} />
                        <TextField
                            type="date"
                            size="small"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                                sx: { fontSize: 14 },
                            }}
                        />
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>—</Typography>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                            bgcolor: 'background.neutral',
                            borderRadius: 1,
                            px: 2,
                            py: 1,
                        }}
                    >
                        <Iconify icon="solar:calendar-date-bold" sx={{ color: 'primary.main' }} />
                        <TextField
                            type="date"
                            size="small"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                                sx: { fontSize: 14 },
                            }}
                        />
                    </Stack>
                </Stack>
            </Card>

            {/* Balance summary cards */}
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Card sx={{ flex: 1, p: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {t('starting_balance')}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">0</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>UZS</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">0</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>USD</Typography>
                    </Stack>
                </Card>

                <Card sx={{ flex: 1, p: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {t('period_net')}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" sx={{ color: periodNetUZS >= 0 ? 'success.main' : 'error.main' }}>
                            {periodNetUZS >= 0 ? '+' : ''}{fCurrency(periodNetUZS)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>UZS</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" sx={{ color: periodNetUSD >= 0 ? 'success.main' : 'error.main' }}>
                            {periodNetUSD >= 0 ? '+' : ''}{periodNetUSD}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>USD</Typography>
                    </Stack>
                </Card>

                <Card sx={{ flex: 1, p: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {t('ending_balance')}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">{fCurrency(periodNetUZS)}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>UZS</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">{periodNetUSD}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>USD</Typography>
                    </Stack>
                </Card>
            </Stack>

            {/* Tabs and Add button */}
            <Card sx={{ borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, pt: 1 }}>
                    <Tabs value={currentTab} onChange={handleTabChange}>
                        {TABS.map((tab) => (
                            <Tab key={tab.value} value={tab.value} label={tab.label} />
                        ))}
                    </Tabs>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleCreate}
                    >
                        {t('add_transaction')}
                    </Button>
                </Stack>

                <Divider />

                {/* Table header */}
                <Box sx={{ px: 2, py: 1.5, bgcolor: 'background.neutral' }}>
                    <Stack direction="row" alignItems="center">
                        <Typography variant="caption" sx={{ width: 100, fontWeight: 600, color: 'text.secondary' }}>
                            {t('table.type')}
                        </Typography>
                        <Typography variant="caption" sx={{ flex: 1, fontWeight: 600, color: 'text.secondary' }}>
                            {t('table.name')}
                        </Typography>
                        <Typography variant="caption" sx={{ width: 120, fontWeight: 600, color: 'text.secondary', textAlign: 'right' }}>
                            {t('table.amount')}
                        </Typography>
                        <Typography variant="caption" sx={{ width: 80, fontWeight: 600, color: 'text.secondary', textAlign: 'center' }}>
                            {t('table.currency')}
                        </Typography>
                        <Typography variant="caption" sx={{ width: 120, fontWeight: 600, color: 'text.secondary' }}>
                            {t('table.date')}
                        </Typography>
                        <Typography variant="caption" sx={{ width: 150, fontWeight: 600, color: 'text.secondary' }}>
                            {t('table.notes')}
                        </Typography>
                        <Typography variant="caption" sx={{ width: 100, fontWeight: 600, color: 'text.secondary', textAlign: 'right' }}>
                            {t('table.actions')}
                        </Typography>
                    </Stack>
                </Box>

                {/* Grouped transactions */}
                {isLoading ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {t('loading')}...
                        </Typography>
                    </Box>
                ) : groupedFinances.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {t('no_data')}
                        </Typography>
                    </Box>
                ) : (
                    groupedFinances.map((group, groupIndex) => {
                        // Calculate balances for this group
                        const groupUZS = calculateBalances(group.items, Currency.UZS);
                        const groupUSD = calculateBalances(group.items, Currency.USD);

                        // Calculate starting balance (sum of all previous groups)
                        const previousGroups = groupedFinances.slice(groupIndex + 1);
                        const startUZS = previousGroups.reduce((acc, g) => acc + calculateBalances(g.items, Currency.UZS), 0);
                        const startUSD = previousGroups.reduce((acc, g) => acc + calculateBalances(g.items, Currency.USD), 0);

                        // Ending balance = starting + this group
                        const endUZS = startUZS + groupUZS;
                        const endUSD = startUSD + groupUSD;

                        return (
                            <Box key={group.date}>
                                {/* Date header */}
                                <Box sx={{ px: 2, py: 1, bgcolor: 'action.hover' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {fDate(group.date)}
                                    </Typography>
                                </Box>

                                {/* Starting balance row */}
                                <Box sx={{ px: 2, py: 1, bgcolor: 'background.neutral' }}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {t('starting_balance')}
                                        </Typography>
                                        <Stack direction="row" spacing={3}>
                                            <Typography variant="body2">
                                                {fCurrency(startUZS)} <Typography component="span" sx={{ color: 'text.secondary' }}>UZS</Typography>
                                            </Typography>
                                            <Typography variant="body2">
                                                {startUSD} <Typography component="span" sx={{ color: 'text.secondary' }}>USD</Typography>
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Box>

                                {/* Transactions for this date */}
                                {group.items.map((item) => (
                                    <Box
                                        key={item.id}
                                        sx={{
                                            px: 2,
                                            py: 1.5,
                                            '&:hover': { bgcolor: 'action.hover' },
                                            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                                            borderLeft: (theme) => `3px solid ${item.finance_type === FinanceType.KIRIM ? theme.palette.success.main : theme.palette.error.main}`,
                                        }}
                                    >
                                        <Stack direction="row" alignItems="center">
                                            <Box sx={{ width: 100 }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: item.finance_type === FinanceType.KIRIM ? 'success.main' : 'error.main',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {t(`form.types.${item.finance_type}`)}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2">
                                                    {item.expense_category
                                                        ? t(`form.categories.${item.expense_category}`)
                                                        : item.notes || '-'}
                                                </Typography>
                                                {item.currency_exchange_rate && (
                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                        Rate: {fCurrency(item.currency_exchange_rate)}
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    width: 120,
                                                    textAlign: 'right',
                                                    fontWeight: 600,
                                                    color: item.finance_type === FinanceType.KIRIM ? 'success.main' : 'error.main',
                                                }}
                                            >
                                                {item.finance_type === FinanceType.KIRIM ? '+' : '-'}
                                                {item.currency === Currency.UZS ? fCurrency(item.value) : item.value}
                                            </Typography>
                                            <Typography variant="body2" sx={{ width: 80, textAlign: 'center' }}>
                                                {item.currency.toUpperCase()}
                                            </Typography>
                                            <Typography variant="body2" sx={{ width: 120 }}>
                                                {fDate(item.date)}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    width: 150,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {item.notes || '-'}
                                            </Typography>
                                            <Stack direction="row" sx={{ width: 100, justifyContent: 'flex-end' }}>
                                                <IconButton size="small" onClick={() => handleHistory(item.id)}>
                                                    <Iconify icon="solar:clock-circle-bold" width={18} />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleEdit(item.id)}>
                                                    <Iconify icon="solar:pen-bold" width={18} />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDeleteClick(item.id)}>
                                                    <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                                                </IconButton>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                ))}

                                {/* Ending balance row */}
                                <Box sx={{ px: 2, py: 1, bgcolor: 'background.neutral' }}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {t('ending_balance')}
                                        </Typography>
                                        <Stack direction="row" spacing={3}>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {fCurrency(endUZS)} <Typography component="span" sx={{ color: 'text.secondary' }}>UZS</Typography>
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {endUSD} <Typography component="span" sx={{ color: 'text.secondary' }}>USD</Typography>
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Box>
                            </Box>
                        );
                    })
                )}
            </Card>

            <FinanceDialog
                open={dialog.value}
                onClose={dialog.onFalse}
                id={selectedId}
                defaultPaymentMethod={PaymentMethod.BANK}
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

            <FinanceHistoryDialog
                open={historyDialog.value}
                onClose={historyDialog.onFalse}
                financeId={historyFinanceId}
            />
        </Container>
    );
}
