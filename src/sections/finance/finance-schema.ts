import { z as zod } from 'zod';

import {
    Currency,
    FinanceType,
    PaymentMethod,
    ExpenseCategory,
    KommunalSubCategory,
} from 'src/types/finance';

export const getFinanceFormSchema = (t: (key: string) => string) =>
    zod
        .object({
            payment_method: zod.nativeEnum(PaymentMethod, {
                required_error: t('payment_method_required'),
            }),
            finance_type: zod.nativeEnum(FinanceType, {
                required_error: t('finance_type_required'),
            }),
            expense_category: zod.nativeEnum(ExpenseCategory).nullable().optional(),
            kommunal_sub_category: zod.nativeEnum(KommunalSubCategory).nullable().optional(),
            client_id: zod.number().nullable().optional(),
            name: zod.string().nullable().optional(),
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
        )
        .refine(
            (data) => {
                if (data.finance_type === FinanceType.KIRIM) {
                    return data.client_id !== null && data.client_id !== undefined && data.client_id > 0;
                }
                return true;
            },
            {
                message: t('client_required'),
                path: ['client_id'],
            }
        )
        .refine(
            (data) => {
                if (data.finance_type === FinanceType.CHIQIM) {
                    return data.expense_category !== null && data.expense_category !== undefined;
                }
                return true;
            },
            {
                message: t('expense_category_required'),
                path: ['expense_category'],
            }
        )
        .refine(
            (data) => {
                if (data.expense_category === ExpenseCategory.KOMMUNAL) {
                    return (
                        data.kommunal_sub_category !== null &&
                        data.kommunal_sub_category !== undefined
                    );
                }
                return true;
            },
            {
                message: t('kommunal_sub_category_required'),
                path: ['kommunal_sub_category'],
            }
        )
        .refine(
            (data) => {
                if (data.finance_type === FinanceType.KIRIM) {
                    return data.name !== null && data.name !== undefined && data.name.trim() !== '';
                }
                return true;
            },
            {
                message: t('name_required'),
                path: ['name'],
            }
        );

export type FinanceFormValues = zod.infer<ReturnType<typeof getFinanceFormSchema>>;
