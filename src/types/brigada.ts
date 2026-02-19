
import type { StanokType } from './stanok';

// ----------------------------------------------------------------------

export type Brigada = {
    id: number;
    version: number;
    name: string;
    leader: string;
    machine_id: number | null;
    machine_type: StanokType;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    archived_at: string | null;
    created_by: number;
    archived_by: number | null;
    previous_id: number | null;
};

export type BrigadaListItem = Pick<Brigada, 'id' | 'version' | 'name' | 'leader' | 'machine_id' | 'machine_type'>;

export type CreateBrigadaRequest = {
    name: string;
    leader?: string;
    machine_id?: number;
    machine_type: StanokType;
};

export type UpdateBrigadaRequest = Partial<CreateBrigadaRequest>;

export type BrigadaMember = {
    id: number;
    version: number;
    brigada_id: number;
    worker_id: number;
    position: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    archived_at: string | null;
    created_by: number;
    archived_by: number | null;
    previous_id: number | null;
};

export type CreateBrigadaMemberRequest = {
    worker_id: number;
    position: string;
};

export type UpdateBrigadaMemberRequest = Partial<CreateBrigadaMemberRequest>;

export type ArchivedBrigadaListItem = {
    id: number;
    name: string;
    leader: string;
    machine_type: StanokType;
    deleted_at: string;
    archived_at: string;
    created_by: number;
    archived_by: number;
};
