import type { Finance, CreateFinanceRequest, UpdateFinanceRequest } from 'src/types/finance';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetClients } from 'src/hooks/use-clients';
import { useGetPartners } from 'src/hooks/use-partners';
import { useGetMaterials } from 'src/hooks/use-materials';
import { useCreateFinance, useUpdateFinance } from 'src/hooks/use-finance';

import { fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import {
    Currency,
    FinanceType,
    PaymentMethod,
    ExpenseCategory,
    ExpenseFrequency,
    ExpenseSubCategory,
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
    const { data: partners = [] } = useGetPartners();
    const { data: materials = [] } = useGetMaterials();

    const { mutateAsync: createFinance, isPending: isCreating } = useCreateFinance();
    const { mutateAsync: updateFinance, isPending: isUpdating } = useUpdateFinance(finance?.id || 0);

    const [kirimType, setKirimType] = useState<'client' | 'davaldiylik'>(
        finance?.davaldiylik_id ? 'davaldiylik' : 'client'
    );

    const isPending = isCreating || isUpdating;

    const defaultValues = useMemo(
        () => ({
            payment_method: finance?.payment_method || defaultPaymentMethod || PaymentMethod.NAQD,
            finance_type: finance?.finance_type || FinanceType.KIRIM,
            expense_category: finance?.expense_category || null,
            expense_subcategory: finance?.expense_subcategory || null,
            expense_frequency: finance?.expense_frequency || null,
            expense_title: finance?.expense_title || '',
            client_id: finance?.client_id || null,
            davaldiylik_id: finance?.davaldiylik_id || null,
            partner_id: finance?.partner_id || null,
            value: finance?.value || 0,
            currency: finance?.currency || Currency.UZS,
            currency_exchange_rate: finance?.currency_exchange_rate || null,
            date: finance?.date || new Date().toISOString(),
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
            setValue('davaldiylik_id', null);
        } else {
            setValue('expense_category', null);
            setValue('expense_subcategory', null);
            setValue('expense_frequency', null);
            setValue('expense_title', null);
            setValue('partner_id', null);
        }
    }, [financeType, setValue]);

    useEffect(() => {
        if (expenseCategory !== ExpenseCategory.KOMMUNAL) {
            setValue('expense_subcategory', null);
        }
        if (expenseCategory !== ExpenseCategory.MAHSULOTLAR) {
            setValue('partner_id', null);
        }
        if (expenseCategory !== ExpenseCategory.BOSHQA) {
            setValue('expense_title', null);
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
                id: client.id,
                label: `${client.fullname} ${client.company ? `(${client.company})` : ''}`,
            })),
        [clients]
    );

    const davaldiylikOptions = useMemo(
        () =>
            materials.map((m) => ({
                id: m.id,
                label: `${m.fullname} ${m.company ? `(${m.company})` : ''}`,
            })),
        [materials]
    );

    const partnerOptions = useMemo(
        () =>
            partners.map((p) => ({
                id: p.id,
                label: `${p.fullname} ${p.company ? `(${p.company})` : ''}`,
            })),
        [partners]
    );

    const handleTabChange = (_: React.SyntheticEvent, newValue: FinanceType) => {
        setValue('finance_type', newValue);
    };

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
                    <Stack spacing={2}>
                        <RadioGroup
                            row
                            value={kirimType}
                            onChange={(e) => {
                                const newValue = e.target.value as 'client' | 'davaldiylik';
                                setKirimType(newValue);
                                if (newValue === 'client') {
                                    setValue('davaldiylik_id', null);
                                } else {
                                    setValue('client_id', null);
                                }
                            }}
                            sx={{ mb: 1 }}
                        >
                            <FormControlLabel
                                value="client"
                                control={<Radio size="medium" />}
                                label={t('form.client')}
                            />
                            <FormControlLabel
                                value="davaldiylik"
                                control={<Radio size="medium" />}
                                label={t('form.davaldiylik')}
                            />
                        </RadioGroup>

                        {kirimType === 'client' ? (
                            <Field.Autocomplete
                                name="client_id"
                                label={t('form.client')}
                                options={clientOptions}
                                getOptionLabel={(option) => {
                                    if (typeof option === 'number') {
                                        return clientOptions.find((c) => c.id === option)?.label || '';
                                    }
                                    return option.label;
                                }}
                                isOptionEqualToValue={(option, value) => {
                                    if (typeof value === 'number') return option.id === value;
                                    return option.id === value.id;
                                }}
                                onChange={(_, newValue) => {
                                    setValue('client_id', newValue?.id || null);
                                }}
                                value={clientOptions.find((c) => c.id === watch('client_id')) || null}
                                slotProps={{ textfield: { InputLabelProps: { shrink: true } } }}
                            />
                        ) : (
                            <Field.Autocomplete
                                name="davaldiylik_id"
                                label={t('form.davaldiylik')}
                                options={davaldiylikOptions}
                                getOptionLabel={(option) => {
                                    if (typeof option === 'number') {
                                        return davaldiylikOptions.find((c) => c.id === option)?.label || '';
                                    }
                                    return option.label;
                                }}
                                isOptionEqualToValue={(option, value) => {
                                    if (typeof value === 'number') return option.id === value;
                                    return option.id === value.id;
                                }}
                                onChange={(_, newValue) => {
                                    setValue('davaldiylik_id', newValue?.id || null);
                                }}
                                value={davaldiylikOptions.find((c) => c.id === watch('davaldiylik_id')) || null}
                                slotProps={{ textfield: { InputLabelProps: { shrink: true } } }}
                            />
                        )}
                    </Stack>
                ) : (
                    <>
                        <Box
                            display="grid"
                            gap={2}
                            gridTemplateColumns={{
                                xs: '1fr',
                                sm: '1fr 1fr',
                            }}
                        >
                            <Field.Select
                                name="expense_category"
                                label={t('form.expense_category')}
                                InputLabelProps={{ shrink: true }}
                                required
                            >
                                {Object.values(ExpenseCategory).map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {t(`form.categories.${category}`)}
                                    </MenuItem>
                                ))}
                            </Field.Select>

                            <Field.Select
                                name="expense_frequency"
                                label={t('form.expense_frequency')}
                                InputLabelProps={{ shrink: true }}
                                required
                            >
                                {Object.values(ExpenseFrequency).map((freq) => (
                                    <MenuItem key={freq} value={freq}>
                                        {t(`form.frequencies.${freq}`)}
                                    </MenuItem>
                                ))}
                            </Field.Select>
                        </Box>

                        {expenseCategory === ExpenseCategory.KOMMUNAL && (
                            <Field.Select
                                name="expense_subcategory"
                                label={t('form.expense_subcategory')}
                                InputLabelProps={{ shrink: true }}
                                required
                            >
                                {Object.values(ExpenseSubCategory).map((sub) => (
                                    <MenuItem key={sub} value={sub}>
                                        {t(`form.kommunal_categories.${sub}`)}
                                    </MenuItem>
                                ))}
                            </Field.Select>
                        )}

                        {expenseCategory === ExpenseCategory.MAHSULOTLAR && (
                            <Field.Autocomplete
                                name="partner_id"
                                label={t('form.partner')}
                                options={partnerOptions}
                                getOptionLabel={(option) => {
                                    if (typeof option === 'number') {
                                        return partnerOptions.find((p) => p.id === option)?.label || '';
                                    }
                                    return option.label;
                                }}
                                isOptionEqualToValue={(option, value) => {
                                    if (typeof value === 'number') return option.id === value;
                                    return option.id === value.id;
                                }}
                                onChange={(_, newValue) => {
                                    setValue('partner_id', newValue?.id || null);
                                }}
                                value={partnerOptions.find((p) => p.id === watch('partner_id')) || null}
                                slotProps={{ textfield: { InputLabelProps: { shrink: true } } }}
                            />
                        )}

                        {expenseCategory === ExpenseCategory.BOSHQA && (
                            <Field.Text
                                name="expense_title"
                                label={t('form.expense_title')}
                                placeholder={t('form.expense_title_placeholder')}
                                InputLabelProps={{ shrink: true }}
                            />
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
                                    px: 1.75,
                                    color: 'text.primary',
                                }}
                            >
                                {fDateTime(new Date(selectedDate), 'DD/MM/YYYY, HH:mm')}
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
