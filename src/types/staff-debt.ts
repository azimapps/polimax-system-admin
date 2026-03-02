export type StaffDebtReason = 'avans' | 'qarz' | 'boshqa';
export type StaffDebtStatus = 'active' | 'paid_off';
export type StaffDebtPaymentMethod = 'naqd' | 'bank' | 'salary_deduction';

export interface StaffDebt {
    id: number;
    version: number;
    staff_id: number;
    fullname: string;
    amount: number;
    reason: StaffDebtReason;
    date: string;
    remaining: number;
    status: StaffDebtStatus;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface StaffDebtPayment {
    id: number;
    debt_id: number;
    amount: number;
    payment_method: StaffDebtPaymentMethod;
    date: string;
    notes?: string;
    created_at: string;
}

export interface StaffDebtDetail extends StaffDebt {
    payments: StaffDebtPayment[];
}

export interface StaffDebtSummary {
    staff_id: number;
    fullname: string;
    total_debt: number;
    total_paid: number;
    total_remaining: number;
    active_debts_count: number;
}
