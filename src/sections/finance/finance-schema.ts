import { z as zod } from 'zod';

import { Currency, FinanceType, PaymentMethod } from 'src/types/finance';

export const getFinanceFormSchema = (t: (key: string) => string) =>
    zod
        .object({
            payment_method: zod.nativeEnum(PaymentMethod, {
                required_error: t('payment_method_required'),
            }),
            finance_type: zod.nativeEnum(FinanceType, {
                required_error: t('finance_type_required'),
            }),
            client_id: zod.number().min(1, t('client_required')),
            value: zod.number().min(0.01, t('value_required')),
            currency: zod.nativeEnum(Currency, {
                required_error: t('currency_required'),
            }),
            currency_exchange_rate: zod.number().nullable().optional(),
            date: zod.string().min(1, t('date_required')),
            notes: zod.string().optional(),
        })
        .refine(
            (data) => {
                if (data.currency === Currency.USD) {
                    return (
                        data.currency_exchange_rate !== null &&
                        data.currency_exchange_rate !== undefined &&
                        data.currency_exchange_rate > 0
                    );
                }
                return true;
            },
            {
                message: t('exchange_rate_required'),
                path: ['currency_exchange_rate'],
            }
        );

export type FinanceFormValues = zod.infer<ReturnType<typeof getFinanceFormSchema>>;
