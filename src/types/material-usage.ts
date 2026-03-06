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
    percentage: number | null;
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
    percentage?: number;
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

export interface ProductionLogMaterial {
    ombor_transaction_id: number;
    used_amount: number;
    remainder_destination: 'machine_warehouse' | 'main_warehouse';
    percentage?: number;
    notes?: string;
}

export interface ProductionLogSend {
    to_brigada_id: number;
    kg_sent: number;
    meters_sent: number;
    kg_waste?: number;
    kg_ostatok?: number;
    notes?: string;
    sushka_end_at?: string;
}

export interface ProductionLogRequest {
    plan_item_id: number;
    meters_produced: number;
    kg_produced: number;
    work_type?: string;
    percentage?: number;
    notes?: string;
    materials?: ProductionLogMaterial[];
    send?: ProductionLogSend;
}

export interface ProductionLog {
    id: number;
    version: number;
    plan_item_id: number;
    brigada_id: number;
    machine_id: number;
    worker_id: number;
    worker_fullname: string;
    meters_produced: number;
    kg_produced: number;
    work_type: string | null;
    percentage: number | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProductionLogSummary {
    plan_item_id: number;
    total_meters: number;
    total_kg: number;
    entries: ProductionLog[];
}

export type StepType = 'reska' | 'pechat' | 'sushka' | 'laminatsiya' | 'tayyor';
export type StepStatus = 'pending' | 'in_progress' | 'completed';

export interface PlanItemStep {
    id: number;
    plan_item_id: number;
    step_number: number;
    step_type: StepType;
    status: StepStatus;
    brigada_id: number | null;
    machine_id: number | null;
    started_at: string | null;
    completed_at: string | null;
    kg_received: number | null;
    kg_produced: number | null;
    kg_waste: number | null;
    kg_ostatok: number | null;
    meters_produced: number | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface MyStep extends PlanItemStep {
    plan_item: {
        id: number;
        order_id: number;
        order_title: string;
        plan_type: string;
        status: string;
    };
}

export interface ProductionSend {
    id: number;
    plan_item_id: number;
    from_step_id: number;
    to_step_id: number;
    from_brigada_id: number;
    to_brigada_id: number | null;
    kg_sent: number;
    meters_sent: number;
    sent_by: number;
    notes: string | null;
    created_at: string;
    tayyor_ombor_item_id?: number;
    tayyor_transaction_id?: number;
}

export interface GetMyStepsParams {
    status?: StepStatus;
    sushka_ready?: boolean;
}

export interface BrigadaMemberInfo {
    id: number;
    worker_id: number;
    fullname: string;
    position: string;
    is_leader: boolean;
}

export interface MyBrigadaDetail {
    brigada: {
        id: number;
        name: string;
        machine_type: string;
        leader_id: number;
    };
    machine: {
        id: number;
        name: string;
        country_code: string;
        type: string;
    };
    members: BrigadaMemberInfo[];
    active_plan_items: number;
    finished_plan_items: number;
}
