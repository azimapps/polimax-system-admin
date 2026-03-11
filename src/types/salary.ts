// ----------------------------------------------------------------------

export type KpiBreakdownItem = {
    work_type: string;
    meters: number;
    rate: number;
    subtotal: number;
};

export type SalaryPreviewItem = {
    staff_id: number;
    fullname: string;
    staff_type: string;
    worker_type: string | null;
    fixed_amount: number;
    kpi_amount: number;
    total_amount: number;
    kpi_breakdown: KpiBreakdownItem[];
};

export type SalaryPreviewResponse = {
    year: number;
    month: number;
    grand_total: number;
    items: SalaryPreviewItem[];
};

export type SalaryStatus = 'confirmed' | 'paid';

export type SalaryRecord = {
    id: number;
    staff_id: number;
    year: number;
    month: number;
    staff_type: string;
    worker_type: string | null;
    fixed_amount: number;
    kpi_amount: number;
    total_amount: number;
    status: SalaryStatus;
    confirmed_by: number | null;
    confirmed_at: string | null;
    paid_by: number | null;
    paid_at: string | null;
    finance_record_id: number | null;
    // Joined fields from backend
    fullname?: string;
};
