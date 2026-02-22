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
    ARENDA = 'arenda',
    MAOSH = 'maosh',
    KOMMUNAL = 'kommunal',
    TRANSPORT = 'transport',
    MAHSULOTLAR = 'mahsulotlar',
    XOM_ASHYO = 'xom_ashyo',
    USKUNA = 'uskuna',
    TAMIRLASH = 'tamirlash',
    BOSHQA = 'boshqa',
}

export enum ExpenseSubCategory {
    ELEKTR = 'elektr',
    GAZ = 'gaz',
    SUV = 'suv',
    KANALIZATSIYA = 'kanalizatsiya',
    CHIQINDI = 'chiqindi',
    ISITISH = 'isitish',
    INTERNET = 'internet',
    TELEFON = 'telefon',
}

export enum ExpenseFrequency {
    RECURRING = 'recurring',
    ONE_TIME = 'one_time',
}

export type FinanceUser = {
    id: number;
    username: string;
    fullname: string;
    role: 'admin' | 'accountant' | 'worker';
};

export type Finance = {
    id: number;
    version: number;
    payment_method: PaymentMethod;
    finance_type: FinanceType;
    expense_category: ExpenseCategory | null;
    expense_subcategory: ExpenseSubCategory | null;
    expense_title: string | null;
    expense_frequency: ExpenseFrequency | null;
    client_id: number | null;
    davaldiylik_id: number | null;
    partner_id: number | null;
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
    created_by_user: FinanceUser;
    archived_by: number | null;
    archived_by_user: FinanceUser | null;
    previous_id: number | null;
};

export type FinanceListItem = Pick<
    Finance,
    | 'id'
    | 'version'
    | 'payment_method'
    | 'finance_type'
    | 'expense_category'
    | 'expense_subcategory'
    | 'expense_title'
    | 'expense_frequency'
    | 'client_id'
    | 'davaldiylik_id'
    | 'partner_id'
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
    expense_subcategory: ExpenseSubCategory | null;
    expense_title: string | null;
    value: number;
    currency: Currency;
    deleted_at: string;
    archived_at: string;
    created_by: number;
    archived_by: number;
    notes?: string;
    date?: string;
    previous_id: number | null;
};

export type CreateFinanceRequest = {
    payment_method: PaymentMethod;
    finance_type: FinanceType;
    expense_category?: ExpenseCategory | null;
    expense_subcategory?: ExpenseSubCategory | null;
    expense_title?: string | null;
    expense_frequency?: ExpenseFrequency | null;
    client_id?: number | null;
    davaldiylik_id?: number | null;
    partner_id?: number | null;
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
    davaldiylik_id?: number;
    expense_category?: ExpenseCategory;
    expense_subcategory?: ExpenseSubCategory;
    expense_frequency?: ExpenseFrequency;
    partner_id?: number;
    q?: string;
};
