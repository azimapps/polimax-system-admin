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
    kpi_breakdown?: KpiBreakdownItem[];
};

export type KpiRates = {
    kpi_salary: number | null;
    kpi_tayyor_mahsulotlar_reskasi: number | null;
    kpi_tayyor_mahsulot_peremotkasi: number | null;
    kpi_plyonka_peremotkasi: number | null;
    kpi_3_5_sm_reska: number | null;
    kpi_asobiy_tarif: number | null;
};

export type SalarySummary = {
    total_fixed: number;
    total_kpi: number;
    total_earned: number;
    total_paid: number;
    total_unpaid: number;
    months_count: number;
};

export type StaffSalaryDetailRecord = {
    id: number;
    year: number;
    month: number;
    fixed_amount: number;
    kpi_amount: number;
    total_amount: number;
    status: SalaryStatus | 'preview';
    confirmed_at: string | null;
    paid_at: string | null;
    kpi_breakdown: KpiBreakdownItem[];
};

export type StaffSalaryDetailResponse = {
    staff_id: number;
    fullname: string;
    staff_type: string;
    worker_type: string | null;
    fixed_salary: number;
    kpi_rates: KpiRates | null;
    records: StaffSalaryDetailRecord[];
    summary: SalarySummary;
};
