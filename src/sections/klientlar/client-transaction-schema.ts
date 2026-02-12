import { z as zod } from 'zod';

export const getClientTransactionFormSchema = (t: (key: string) => string) =>
    zod.object({
        value: zod.number().min(0.01, t('value_required')),
        currency_exchange_rate: zod.number().min(1, t('exchange_rate_required')),
        date: zod.string().min(1, t('date_required')),
        notes: zod.string().optional(),
    });

export type ClientTransactionFormValues = zod.infer<
    ReturnType<typeof getClientTransactionFormSchema>
>;
