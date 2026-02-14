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

export enum ExpenseCategory {
    MAHSULOTLAR = 'mahsulotlar',
    KOMMUNAL = 'kommunal',
    SOLIQLAR = 'soliqlar',
    QARZ = 'qarz',
    OZIQ_OVQAT = 'oziq_ovqat',
    TRANSPORT = 'transport',
    REMONT = 'remont',
    BOSHQA = 'boshqa',
}

export enum KommunalSubCategory {
    SVET = 'svet',
    GAZ = 'gaz',
    SUV = 'suv',
    INTERNET = 'internet',
    MUSOR = 'musor',
    ARENDA = 'arenda',
    BOSHQA = 'boshqa',
}

export type Finance = {
    id: number;
    version: number;
    payment_method: PaymentMethod;
    finance_type: FinanceType;
    expense_category: ExpenseCategory | null;
    kommunal_sub_category: KommunalSubCategory | null;
    client_id: number | null;
    name: string | null;
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
    | 'expense_category'
    | 'kommunal_sub_category'
    | 'client_id'
    | 'name'
    | 'value'
    | 'currency'
    | 'currency_exchange_rate'
    | 'date'
    | 'notes'
>;

export type ArchivedFinanceListItem = {
    id: number;
    payment_method: PaymentMethod;
    finance_type: FinanceType;
    expense_category: ExpenseCategory | null;
    kommunal_sub_category: KommunalSubCategory | null;
    name: string | null;
    value: number;
    currency: Currency;
    deleted_at: string;
    archived_at: string;
    created_by: number;
    archived_by: number;
    notes?: string;
    date?: string;
};

export type CreateFinanceRequest = {
    payment_method: PaymentMethod;
    finance_type: FinanceType;
    expense_category?: ExpenseCategory | null;
    kommunal_sub_category?: KommunalSubCategory | null;
    client_id?: number | null;
    name?: string | null;
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
