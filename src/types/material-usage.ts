export interface MaterialUsage {
    id: number;
    version: number;
    ombor_transaction_id: number;
    brigada_id: number;
    machine_id: number;
    plan_item_id: number;
    ombor_item_id: number;
    issued_amount: number;
    used_amount: number;
    remainder: number;
    remainder_destination: 'machine_warehouse' | 'main_warehouse';
    return_transaction_id: number | null;
    notes: string | null;
    ombor_item_name: string;
    ombor_item_type: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    archived_at: string | null;
    created_by: number;
    archived_by: number | null;
    previous_id: number | null;
}

export interface MachineStock {
    ombor_item_id: number;
    ombor_item_name: string;
    ombor_item_type: string;
    total_received: number;
    total_used: number;
    total_returned: number;
    stock_at_machine: number;
}

export interface PlanItemMaterialUsage {
    ombor_item_id: number;
    ombor_item_name: string;
    ombor_item_type: string;
    total_received: number;
    total_used: number;
    remaining: number;
    price_per_unit: number;
    price_currency: string;
    cost: number;
}

export interface PlanItemMaterialsSummary {
    plan_item_id: number;
    materials: PlanItemMaterialUsage[];
    total_cost: number;
}

export interface PlanItemTransfer {
    id: number;
    plan_item_id: number;
    from_brigada_id: number;
    from_machine_id: number;
    to_brigada_id: number;
    to_machine_id: number;
    transferred_by: number;
    notes: string | null;
    created_at: string;
}

export interface LogMaterialUsageRequest {
    ombor_transaction_id: number;
    plan_item_id: number;
    used_amount: number;
    remainder_destination: 'machine_warehouse' | 'main_warehouse';
    notes?: string;
}

export interface TransferPlanItemRequest {
    to_brigada_id: number;
    notes?: string;
}

export interface GetMaterialUsagesParams {
    ombor_item_id?: number;
    date_from?: string;
    date_to?: string;
    limit?: number;
    offset?: number;
}
