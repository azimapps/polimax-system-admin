import type { Finance, CreateFinanceRequest, UpdateFinanceRequest } from 'src/types/finance';

import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';

import { useGetClients } from 'src/hooks/use-clients';
import { useCreateFinance, useUpdateFinance } from 'src/hooks/use-finance';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { Currency, FinanceType, PaymentMethod } from 'src/types/finance';

import { getFinanceFormSchema } from './finance-schema';

// ----------------------------------------------------------------------

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
            client_id: finance?.client_id || 0,
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

    useEffect(() => {
        if (currency === Currency.UZS) {
            setValue('currency_exchange_rate', null);
        }
    }, [currency, setValue]);

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

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3}>
                <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                    }}
                >
                    <Field.Select
                        name="finance_type"
                        label={t('form.finance_type')}
                        InputLabelProps={{ shrink: true }}
                        required
                    >
                        <MenuItem value={FinanceType.KIRIM}>{t('form.types.kirim')}</MenuItem>
                        <MenuItem value={FinanceType.CHIQIM}>{t('form.types.chiqim')}</MenuItem>
                    </Field.Select>

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
                            setValue('client_id', newValue?.value || 0);
                        }}
                        value={clientOptions.find((c) => c.value === watch('client_id')) || null}
                        slotProps={{
                            textfield: {
                                InputLabelProps: { shrink: true },
                            },
                        }}
                    />

                    <Field.Text
                        name="value"
                        label={t('form.value')}
                        type="number"
                        InputLabelProps={{ shrink: true }}
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

                    {currency === Currency.USD && (
                        <Field.Text
                            name="currency_exchange_rate"
                            label={t('form.exchange_rate')}
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    )}

                    <Field.Text
                        name="date"
                        label={t('form.date')}
                        type="datetime-local"
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                </Box>

                <Field.Text
                    name="notes"
                    label={t('form.notes')}
                    placeholder={t('form.notes_placeholder')}
                    InputLabelProps={{ shrink: true }}
                    multiline
                    rows={3}
                />

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
