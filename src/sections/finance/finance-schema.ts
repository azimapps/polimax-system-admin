import { z as zod } from 'zod';

import {
    Currency,
    FinanceType,
    PaymentMethod,
    ExpenseCategory,
    ExpenseFrequency,
    ExpenseSubCategory,
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
            expense_subcategory: zod.nativeEnum(ExpenseSubCategory).nullable().optional(),
            expense_frequency: zod.nativeEnum(ExpenseFrequency).nullable().optional(),
            expense_title: zod.string().nullable().optional(),
            client_id: zod.number().nullable().optional(),
            davaldiylik_id: zod.number().nullable().optional(),
            partner_id: zod.number().nullable().optional(),
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
                    const hasClient = data.client_id !== null && data.client_id !== undefined && data.client_id > 0;
                    const hasDavaldiylik = data.davaldiylik_id !== null && data.davaldiylik_id !== undefined && data.davaldiylik_id > 0;
                    return hasClient || hasDavaldiylik;
                }
                return true;
            },
            {
                message: t('client_or_davaldiylik_required'),
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
                if (data.finance_type === FinanceType.CHIQIM) {
                    return data.expense_frequency !== null && data.expense_frequency !== undefined;
                }
                return true;
            },
            {
                message: t('expense_frequency_required'),
                path: ['expense_frequency'],
            }
        )
        .refine(
            (data) => {
                if (data.expense_category === ExpenseCategory.KOMMUNAL) {
                    return (
                        data.expense_subcategory !== null &&
                        data.expense_subcategory !== undefined
                    );
                }
                return true;
            },
            {
                message: t('expense_subcategory_required'),
                path: ['expense_subcategory'],
            }
        )
        .refine(
            (data) => {
                if (data.expense_category === ExpenseCategory.MAHSULOTLAR) {
                    return (
                        data.partner_id !== null &&
                        data.partner_id !== undefined &&
                        data.partner_id > 0
                    );
                }
                return true;
            },
            {
                message: t('partner_required'),
                path: ['partner_id'],
            }
        );

export type FinanceFormValues = zod.infer<ReturnType<typeof getFinanceFormSchema>>;
