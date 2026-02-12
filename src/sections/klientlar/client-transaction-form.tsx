import type {
    ClientTransaction,
    CreateClientTransactionRequest,
    UpdateClientTransactionRequest,
} from 'src/types/client-transaction';

import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import {
    useCreateClientTransaction,
    useUpdateClientTransaction,
} from 'src/hooks/use-client-transactions';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { getClientTransactionFormSchema } from './client-transaction-schema';

// ----------------------------------------------------------------------

type Props = {
    clientId: number;
    transaction?: ClientTransaction;
    onSuccess?: () => void;
};

export function ClientTransactionForm({ clientId, transaction, onSuccess }: Props) {
    const { t } = useTranslate('client');
    const isEdit = !!transaction;

    const { mutateAsync: createTransaction, isPending: isCreating } =
        useCreateClientTransaction(clientId);
    const { mutateAsync: updateTransaction, isPending: isUpdating } = useUpdateClientTransaction(
        clientId,
        transaction?.id || 0
    );

    const isPending = isCreating || isUpdating;

    const defaultValues = useMemo(
        () => ({
            value: transaction?.value || 0,
            currency_exchange_rate: transaction?.currency_exchange_rate || 12800,
            date: transaction?.date
                ? transaction.date.slice(0, 16)
                : new Date().toISOString().slice(0, 16),
            notes: transaction?.notes || '',
        }),
        [transaction]
    );

    const methods = useForm<CreateClientTransactionRequest>({
        resolver: zodResolver(getClientTransactionFormSchema(t)),
        defaultValues,
    });

    const { handleSubmit, reset } = methods;

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
                await updateTransaction(submitData as UpdateClientTransactionRequest);
                toast.success(t('transaction.messages.success_update'));
            } else {
                await createTransaction(submitData);
                toast.success(t('transaction.messages.success_create'));
            }
            onSuccess?.();
        } catch (error) {
            console.error(error);
            toast.error(t('transaction.messages.error_generic'));
        }
    });

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
                    <Field.Text
                        name="value"
                        label={t('transaction.form.value')}
                        type="number"
                        InputLabelProps={{ shrink: true }}
                        required
                    />

                    <Field.Text
                        name="currency_exchange_rate"
                        label={t('transaction.form.exchange_rate')}
                        type="number"
                        InputLabelProps={{ shrink: true }}
                        required
                    />

                    <Field.Text
                        name="date"
                        label={t('transaction.form.date')}
                        type="datetime-local"
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                </Box>

                <Field.Text
                    name="notes"
                    label={t('transaction.form.notes')}
                    placeholder={t('transaction.form.notes_placeholder')}
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
