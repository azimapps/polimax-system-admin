import { z as zod } from 'zod';

import { ExpenseCategory, ExpenseFrequency } from 'src/types/expense';

export const getExpenseFormSchema = (t: (key: string) => string) =>
    zod.object({
        category: zod.nativeEnum(ExpenseCategory, {
            required_error: t('category_required'),
        }),
        frequency: zod.nativeEnum(ExpenseFrequency, {
            required_error: t('frequency_required'),
        }),
        amount: zod.number().min(0.01, t('amount_required')),
        notes: zod.string().optional(),
    });

export type ExpenseFormValues = zod.infer<ReturnType<typeof getExpenseFormSchema>>;
