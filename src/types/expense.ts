export enum ExpenseFrequency {
    RECURRING = 'recurring',
    ONE_TIME = 'one_time',
}

export enum ExpenseCategory {
    ARENDA = 'arenda',
    MAOSH = 'maosh',
    KOMMUNAL = 'kommunal',
    TRANSPORT = 'transport',
    XOM_ASHYO = 'xom_ashyo',
    USKUNA = 'uskuna',
    TAMIRLASH = 'tamirlash',
    BOSHQA = 'boshqa',
}

export type Expense = {
    id: number;
    version: number;
    category: ExpenseCategory;
    frequency: ExpenseFrequency;
    amount: number;
    notes: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    archived_at: string | null;
    created_by: number;
    archived_by: number | null;
    previous_id: number | null;
};

export type ExpenseListItem = Pick<
    Expense,
    'id' | 'version' | 'category' | 'frequency' | 'amount' | 'notes'
>;

export type ArchivedExpenseListItem = {
    id: number;
    category: ExpenseCategory;
    frequency: ExpenseFrequency;
    amount: number;
    deleted_at: string;
    archived_at: string;
    created_by: number;
    archived_by: number;
    notes?: string;
};

export type CreateExpenseRequest = {
    category: ExpenseCategory;
    frequency: ExpenseFrequency;
    amount: number;
    notes?: string;
};

export type UpdateExpenseRequest = Partial<CreateExpenseRequest>;

export type ExpenseQueryParams = {
    category?: ExpenseCategory;
    frequency?: ExpenseFrequency;
    q?: string;
};
