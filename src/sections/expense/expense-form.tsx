import type { Expense, CreateExpenseRequest, UpdateExpenseRequest } from 'src/types/expense';

import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';

import { useCreateExpense, useUpdateExpense } from 'src/hooks/use-expense';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { ExpenseCategory, ExpenseFrequency } from 'src/types/expense';

import { getExpenseFormSchema } from './expense-schema';

// ----------------------------------------------------------------------

type Props = {
    expense?: Expense;
    onSuccess?: () => void;
};

export function ExpenseForm({ expense, onSuccess }: Props) {
    const { t } = useTranslate('expense');
    const isEdit = !!expense;

    const { mutateAsync: createExpense, isPending: isCreating } = useCreateExpense();
    const { mutateAsync: updateExpense, isPending: isUpdating } = useUpdateExpense(expense?.id || 0);

    const isPending = isCreating || isUpdating;

    const defaultValues = useMemo(
        () => ({
            category: expense?.category || ExpenseCategory.ARENDA,
            frequency: expense?.frequency || ExpenseFrequency.RECURRING,
            amount: expense?.amount || 0,
            notes: expense?.notes || '',
        }),
        [expense]
    );

    const methods = useForm<CreateExpenseRequest>({
        resolver: zodResolver(getExpenseFormSchema(t)),
        defaultValues,
    });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (isEdit) {
                await updateExpense(data as UpdateExpenseRequest);
                toast.success(t('messages.success_update'));
            } else {
                await createExpense(data);
                toast.success(t('messages.success_create'));
            }
            onSuccess?.();
        } catch (error) {
            console.error(error);
            toast.error(t('messages.error_generic'));
        }
    });

    const CATEGORY_OPTIONS = [
        { value: ExpenseCategory.ARENDA, label: t('form.categories.arenda') },
        { value: ExpenseCategory.MAOSH, label: t('form.categories.maosh') },
        { value: ExpenseCategory.KOMMUNAL, label: t('form.categories.kommunal') },
        { value: ExpenseCategory.TRANSPORT, label: t('form.categories.transport') },
        { value: ExpenseCategory.XOM_ASHYO, label: t('form.categories.xom_ashyo') },
        { value: ExpenseCategory.USKUNA, label: t('form.categories.uskuna') },
        { value: ExpenseCategory.TAMIRLASH, label: t('form.categories.tamirlash') },
        { value: ExpenseCategory.BOSHQA, label: t('form.categories.boshqa') },
    ];

    const FREQUENCY_OPTIONS = [
        { value: ExpenseFrequency.RECURRING, label: t('form.frequencies.recurring') },
        { value: ExpenseFrequency.ONE_TIME, label: t('form.frequencies.one_time') },
    ];

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
                        name="category"
                        label={t('form.category')}
                        InputLabelProps={{ shrink: true }}
                        required
                    >
                        {CATEGORY_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Field.Select>

                    <Field.Select
                        name="frequency"
                        label={t('form.frequency')}
                        InputLabelProps={{ shrink: true }}
                        required
                    >
                        {FREQUENCY_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Field.Select>

                    <Field.Text
                        name="amount"
                        label={t('form.amount')}
                        type="number"
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
