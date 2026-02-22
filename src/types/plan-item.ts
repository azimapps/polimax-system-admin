export enum PlanItemStatus {
    IN_PROGRESS = 'in_progress',
    FINISHED = 'finished',
}

export type PlanItem = {
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

    // Optional expansions (from single item GET endpoint)
    order?: any;
    brigada?: any;
    machine?: any;
};

export type PlanItemListItem = Pick<PlanItem, 'id' | 'version' | 'order_id' | 'brigada_id' | 'machine_id' | 'start_date' | 'end_date' | 'status'>;

export type CreatePlanItemRequest = {
    order_id: number;
    brigada_id: number;
    machine_id: number;
    start_date: string;
    end_date: string;
    status?: PlanItemStatus;
};

export type UpdatePlanItemRequest = Partial<CreatePlanItemRequest>;

export type ArchivedPlanItemListItem = {
    id: number;
    order_id: number;
    brigada_id: number;
    machine_id: number;
    status: PlanItemStatus;
    deleted_at: string;
    archived_at: string;
    created_by: number;
    archived_by: number;
};
