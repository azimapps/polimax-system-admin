
export enum StaffType {
    CRM = 'crm',
    ACCOUNTANT = 'accountant',
    PLANNER = 'planner',
    WORKER = 'worker',
}

export enum WorkerType {
    LAMINATSIYA = 'laminatsiya',
    PECHAT = 'pechat',
    RESKA = 'reska',
}

export enum AccountantType {
    KIRIM_CHIQIM = 'kirim_chiqim',
    OYLIK = 'oylik',
    ISHLAB_CHIQARISH = 'ishlab_chiqarish',
    OMBOR = 'ombor',
}

export interface Staff {
    id: number;
    version: number;
    fullname: string;
    phone_number: string | null;
    notes: string | null;
    avatar_url: string | null;
    image_gallery_urls: string[] | null;
    type: StaffType;
    accountant_type: AccountantType | null;
    worker_type: WorkerType | null;
    fixed_salary: number | null;
    worker_fixed_salary: number | null;
    starting_salary: number | null;
    kpi_salary: number | null;
    kpi_tayyor_mahsulotlar_reskasi: number | null;
    kpi_tayyor_mahsulot_peremotkasi: number | null;
    kpi_plyonka_peremotkasi: number | null;
    kpi_3_5_sm_reska: number | null;
    kpi_asobiy_tarif: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    archived_at: string | null;
    created_by: number | null;
    archived_by: number | null;
    previous_id: number | null;
}

export interface CreateStaffRequest {
    fullname: string;
    type: StaffType;
    phone_number?: string | null;
    notes?: string | null;
    avatar_url?: string | null;
    image_gallery_urls?: string[] | null;
    accountant_type?: AccountantType | null;
    worker_type?: WorkerType | null;
    fixed_salary?: number | null;
    worker_fixed_salary?: number | null;
    starting_salary?: number | null;
    kpi_salary?: number | null;
    kpi_tayyor_mahsulotlar_reskasi?: number | null;
    kpi_tayyor_mahsulot_peremotkasi?: number | null;
    kpi_plyonka_peremotkasi?: number | null;
    kpi_3_5_sm_reska?: number | null;
    kpi_asobiy_tarif?: number | null;
}

export interface UpdateStaffRequest extends Partial<CreateStaffRequest> { }
