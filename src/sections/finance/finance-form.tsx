import type { Finance, CreateFinanceRequest, UpdateFinanceRequest } from 'src/types/finance';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetClients } from 'src/hooks/use-clients';
import { useCreateFinance, useUpdateFinance } from 'src/hooks/use-finance';

import { fDate, fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import {
    Currency,
    FinanceType,
    PaymentMethod,
    ExpenseCategory,
    KommunalSubCategory,
} from 'src/types/finance';

import { getFinanceFormSchema } from './finance-schema';

// ----------------------------------------------------------------------

const EXCHANGE_RATE_API = 'https://cbu.uz/uz/arkhiv-kursov-valyut/json/';

type Props = {
    finance?: Finance;
    onSuccess?: () => void;
    defaultPaymentMethod?: PaymentMethod;
};

export function FinanceForm({ finance, onSuccess, defaultPaymentMethod }: Props) {
    const { t } = useTranslate('finance');
    const isEdit = !!finance;

    const { data: clients = [] } = useGetClients();

    const { mutateAsync: createFinance, isPending: isCreating } = useCreateFinance();
    const { mutateAsync: updateFinance, isPending: isUpdating } = useUpdateFinance(finance?.id || 0);

    const isPending = isCreating || isUpdating;

    const defaultValues = useMemo(
        () => ({
            payment_method: finance?.payment_method || defaultPaymentMethod || PaymentMethod.NAQD,
            finance_type: finance?.finance_type || FinanceType.KIRIM,
            expense_category: finance?.expense_category || null,
            kommunal_sub_category: finance?.kommunal_sub_category || null,
            client_id: finance?.client_id || null,
            name: finance?.name || '',
            value: finance?.value || 0,
            currency: finance?.currency || Currency.UZS,
            currency_exchange_rate: finance?.currency_exchange_rate || null,
            date: finance?.date ? finance.date.slice(0, 16) : new Date().toISOString().slice(0, 16),
            notes: finance?.notes || '',
        }),
        [finance, defaultPaymentMethod]
    );

    const methods = useForm<CreateFinanceRequest>({
        resolver: zodResolver(getFinanceFormSchema(t)),
        defaultValues,
    });

    const { handleSubmit, watch, setValue, reset } = methods;

    const currency = watch('currency');
    const financeType = watch('finance_type');
    const expenseCategory = watch('expense_category');
    const selectedDate = watch('date');
    const exchangeRate = watch('currency_exchange_rate');

    // Fetch live exchange rate when USD is selected
    const fetchExchangeRate = useCallback(async () => {
        try {
            const response = await fetch(EXCHANGE_RATE_API);
            const data = await response.json();
            const usdRate = data.find((item: { Ccy: string }) => item.Ccy === 'USD');
            if (usdRate) {
                setValue('currency_exchange_rate', parseFloat(usdRate.Rate));
            }
        } catch (error) {
            console.error('Failed to fetch exchange rate:', error);
        }
    }, [setValue]);

    useEffect(() => {
        if (currency === Currency.USD && !exchangeRate) {
            fetchExchangeRate();
        } else if (currency === Currency.UZS) {
            setValue('currency_exchange_rate', null);
        }
    }, [currency, exchangeRate, fetchExchangeRate, setValue]);

    useEffect(() => {
        if (financeType === FinanceType.CHIQIM) {
            setValue('client_id', null);
            setValue('name', null);
        } else {
            setValue('expense_category', null);
            setValue('kommunal_sub_category', null);
        }
    }, [financeType, setValue]);

    useEffect(() => {
        if (expenseCategory !== ExpenseCategory.KOMMUNAL) {
            setValue('kommunal_sub_category', null);
        }
    }, [expenseCategory, setValue]);

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const submitData = {
                ...data,
                date: new Date(data.date).toISOString(),
            };

            if (isEdit) {
                await updateFinance(submitData as UpdateFinanceRequest);
                toast.success(t('messages.success_update'));
            } else {
                await createFinance(submitData);
                toast.success(t('messages.success_create'));
            }
            onSuccess?.();
        } catch (error) {
            console.error(error);
            toast.error(t('messages.error_generic'));
        }
    });

    const clientOptions = useMemo(
        () =>
            clients.map((client) => ({
                value: client.id,
                label: client.fullname,
            })),
        [clients]
    );

    const handleTabChange = (_: React.SyntheticEvent, newValue: FinanceType) => {
        setValue('finance_type', newValue);
    };

    const formattedDate = selectedDate ? fDate(new Date(selectedDate), 'yyyy-MM-dd') : '';

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3}>
                {/* Finance Type Toggle Tabs */}
                <Box
                    sx={{
                        bgcolor: 'background.neutral',
                        borderRadius: 2,
                        p: 0.5,
                    }}
                >
                    <Tabs
                        value={financeType}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{
                            minHeight: 48,
                            '& .MuiTabs-indicator': {
                                display: 'none',
                            },
                            '& .MuiTab-root': {
                                minHeight: 44,
                                borderRadius: 1.5,
                                fontWeight: 600,
                                transition: 'all 0.2s',
                                '&.Mui-selected': {
                                    bgcolor: 'background.paper',
                                    boxShadow: (theme) => theme.shadows[2],
                                },
                            },
                        }}
                    >
                        <Tab
                            label={t('form.types.kirim')}
                            value={FinanceType.KIRIM}
                            sx={{
                                '&.Mui-selected': {
                                    color: 'success.main',
                                },
                            }}
                        />
                        <Tab
                            label={t('form.types.chiqim')}
                            value={FinanceType.CHIQIM}
                            sx={{
                                '&.Mui-selected': {
                                    color: 'error.main',
                                },
                            }}
                        />
                    </Tabs>
                </Box>

                {/* Dynamic Fields Based on Finance Type */}
                {financeType === FinanceType.KIRIM ? (
                    <>
                        {/* Client Selection for Kirim */}
                        <Field.Autocomplete
                            name="client_id"
                            label={t('form.client')}
                            options={clientOptions}
                            getOptionLabel={(option) => {
                                if (typeof option === 'number') {
                                    const client = clientOptions.find((c) => c.value === option);
                                    return client?.label || '';
                                }
                                return option.label;
                            }}
                            isOptionEqualToValue={(option, value) => option.value === value}
                            onChange={(_, newValue) => {
                                setValue('client_id', newValue?.value || null);
                            }}
                            value={clientOptions.find((c) => c.value === watch('client_id')) || null}
                            slotProps={{
                                textfield: {
                                    InputLabelProps: { shrink: true },
                                },
                            }}
                        />

                        {/* Name Field for Kirim */}
                        <Field.Text
                            name="name"
                            label={t('form.name')}
                            placeholder={t('form.name_placeholder')}
                            InputLabelProps={{ shrink: true }}
                        />
                    </>
                ) : (
                    <>
                        {/* Expense Category for Chiqim */}
                        <Field.Select
                            name="expense_category"
                            label={t('form.expense_category')}
                            InputLabelProps={{ shrink: true }}
                            required
                        >
                            <MenuItem value={ExpenseCategory.MAHSULOTLAR}>
                                {t('form.categories.mahsulotlar')}
                            </MenuItem>
                            <MenuItem value={ExpenseCategory.KOMMUNAL}>
                                {t('form.categories.kommunal')}
                            </MenuItem>
                            <MenuItem value={ExpenseCategory.SOLIQLAR}>
                                {t('form.categories.soliqlar')}
                            </MenuItem>
                            <MenuItem value={ExpenseCategory.QARZ}>
                                {t('form.categories.qarz')}
                            </MenuItem>
                            <MenuItem value={ExpenseCategory.OZIQ_OVQAT}>
                                {t('form.categories.oziq_ovqat')}
                            </MenuItem>
                            <MenuItem value={ExpenseCategory.TRANSPORT}>
                                {t('form.categories.transport')}
                            </MenuItem>
                            <MenuItem value={ExpenseCategory.REMONT}>
                                {t('form.categories.remont')}
                            </MenuItem>
                            <MenuItem value={ExpenseCategory.BOSHQA}>
                                {t('form.categories.boshqa')}
                            </MenuItem>
                        </Field.Select>

                        {/* Kommunal Sub-Category */}
                        {expenseCategory === ExpenseCategory.KOMMUNAL && (
                            <Field.Select
                                name="kommunal_sub_category"
                                label={t('form.kommunal_sub_category')}
                                InputLabelProps={{ shrink: true }}
                                required
                            >
                                <MenuItem value={KommunalSubCategory.SVET}>
                                    {t('form.kommunal_categories.svet')}
                                </MenuItem>
                                <MenuItem value={KommunalSubCategory.GAZ}>
                                    {t('form.kommunal_categories.gaz')}
                                </MenuItem>
                                <MenuItem value={KommunalSubCategory.SUV}>
                                    {t('form.kommunal_categories.suv')}
                                </MenuItem>
                                <MenuItem value={KommunalSubCategory.INTERNET}>
                                    {t('form.kommunal_categories.internet')}
                                </MenuItem>
                                <MenuItem value={KommunalSubCategory.MUSOR}>
                                    {t('form.kommunal_categories.musor')}
                                </MenuItem>
                                <MenuItem value={KommunalSubCategory.ARENDA}>
                                    {t('form.kommunal_categories.arenda')}
                                </MenuItem>
                                <MenuItem value={KommunalSubCategory.BOSHQA}>
                                    {t('form.kommunal_categories.boshqa')}
                                </MenuItem>
                            </Field.Select>
                        )}
                    </>
                )}

                {/* Amount and Currency */}
                <Box
                    display="grid"
                    gap={2}
                    gridTemplateColumns={{
                        xs: '1fr',
                        sm: '2fr 1fr',
                    }}
                >
                    <Field.Text
                        name="value"
                        label={t('form.value')}
                        type="number"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Typography variant="body2" color="text.secondary">
                                        {currency === Currency.USD ? 'USD' : 'UZS'}
                                    </Typography>
                                </InputAdornment>
                            ),
                        }}
                        helperText={
                            currency === Currency.USD && exchangeRate
                                ? `≈ ${((watch('value') || 0) * exchangeRate).toLocaleString()} UZS`
                                : undefined
                        }
                        required
                    />

                    <Field.Select
                        name="currency"
                        label={t('form.currency')}
                        InputLabelProps={{ shrink: true }}
                        required
                    >
                        <MenuItem value={Currency.UZS}>{t('form.currencies.uzs')}</MenuItem>
                        <MenuItem value={Currency.USD}>{t('form.currencies.usd')}</MenuItem>
                    </Field.Select>
                </Box>

                {/* Exchange Rate (only for USD) */}
                {currency === Currency.USD && (
                    <Field.Text
                        name="currency_exchange_rate"
                        label={t('form.exchange_rate')}
                        type="number"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            endAdornment: exchangeRate ? undefined : (
                                <InputAdornment position="end">
                                    <CircularProgress size={20} />
                                </InputAdornment>
                            ),
                        }}
                        helperText={
                            formattedDate
                                ? t('form.rate_for_date', { date: formattedDate })
                                : undefined
                        }
                        required
                    />
                )}

                {/* Date - Read Only */}
                <Field.Text
                    name="date"
                    label={t('form.date')}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                        readOnly: true,
                        inputComponent: () => (
                            <Typography
                                sx={{
                                    py: 1.5,
                                    px: 0,
                                    color: 'text.primary',
                                }}
                            >
                                {fDateTime(new Date(selectedDate), 'dd/MM/yyyy, HH:mm')}
                            </Typography>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            cursor: 'default',
                        },
                    }}
                />

                {/* Notes */}
                <Field.Text
                    name="notes"
                    label={t('form.notes')}
                    placeholder={t('form.notes_placeholder')}
                    InputLabelProps={{ shrink: true }}
                    multiline
                    rows={3}
                />

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                    <Button variant="outlined" color="inherit" onClick={() => onSuccess?.()}>
                        {t('cancel')}
                    </Button>
                    <LoadingButton type="submit" variant="contained" loading={isPending}>
                        {isEdit ? t('update') : t('create')}
                    </LoadingButton>
                </Stack>
            </Stack>
        </Form>
    );
}
