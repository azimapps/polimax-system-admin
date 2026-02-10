
export enum StanokType {
    PECHAT = 'pechat',
    RESKA = 'reska',
    LAMINATSIYA = 'laminatsiya',
}

export interface Stanok {
    id: number;
    version: number;
    country_code: string;
    name: string;
    type: StanokType;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    archived_at: string | null;
    created_by: number | null;
    archived_by: number | null;
    previous_id: number | null;
}

export interface CreateStanokRequest {
    country_code: string;
    name: string;
    type: StanokType;
}

export interface UpdateStanokRequest extends Partial<CreateStanokRequest> { }
