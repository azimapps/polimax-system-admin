export type PlanItemStatus = 'in_progress' | 'finished';

export interface PlanItem {
    id: number;
    version: number;
    order_id: number;
    brigada_id: number;
    machine_id: number;
    start_date: string;
    end_date: string;
    status: PlanItemStatus;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    archived_at: string | null;
    created_by: number;
    archived_by: number | null;
    previous_id: number | null;
}

export interface MyMaterialsTransaction {
    id: number;
    version: number;
    ombor_item_id: number;
    transaction_type: 'kirim' | 'chiqim';
    date: string;
    quantity_kg: number | null;
    quantity_liter: number | null;
    quantity_count: number | null;
    quantity_barrels: number | null;
    notes: string;
    plan_item_id: number | null;
    stanok_id: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    archived_at: string | null;
    created_by: number;
    archived_by: number | null;
    previous_id: number | null;
}

export interface GetMyBrigadaParams {
    status?: string;
    order_id?: number;
    machine_id?: number;
    start_date_from?: string;
    start_date_to?: string;
    end_date_from?: string;
    end_date_to?: string;
    limit?: number;
    offset?: number;
}

export interface GetMyMaterialsParams {
    transaction_type?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
    offset?: number;
}
