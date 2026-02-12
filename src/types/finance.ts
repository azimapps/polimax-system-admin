export enum PaymentMethod {
    NAQD = 'naqd',
    BANK = 'bank',
}

export enum FinanceType {
    KIRIM = 'kirim',
    CHIQIM = 'chiqim',
}

export enum Currency {
    UZS = 'uzs',
    USD = 'usd',
}

export type Finance = {
    id: number;
    version: number;
    payment_method: PaymentMethod;
    finance_type: FinanceType;
    client_id: number;
    value: number;
    currency: Currency;
    currency_exchange_rate: number | null;
    date: string;
    notes: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    archived_at: string | null;
    created_by: number;
    archived_by: number | null;
    previous_id: number | null;
};

export type FinanceListItem = Pick<
    Finance,
    | 'id'
    | 'version'
    | 'payment_method'
    | 'finance_type'
    | 'client_id'
    | 'value'
    | 'currency'
    | 'currency_exchange_rate'
    | 'date'
    | 'notes'
>;

export type CreateFinanceRequest = {
    payment_method: PaymentMethod;
    finance_type: FinanceType;
    client_id: number;
    value: number;
    currency: Currency;
    currency_exchange_rate?: number | null;
    date: string;
    notes?: string;
};

export type UpdateFinanceRequest = Partial<CreateFinanceRequest>;

export type FinanceQueryParams = {
    finance_type?: FinanceType;
    payment_method?: PaymentMethod;
    currency?: Currency;
    client_id?: number;
    q?: string;
};
