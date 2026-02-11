export interface Material {
    id: number;
    version: number;
    fullname: string;
    phone_number: string;
    company: string | null;
    notes: string | null;
    logo_url: string | null;
    image_urls: string[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    archived_at: string | null;
    created_by: number;
    archived_by: number | null;
    previous_id: number | null;
}

export interface MaterialListItem {
    id: number;
    version: number;
    fullname: string;
    phone_number: string;
    company: string | null;
    logo_url?: string | null;
}

export interface CreateMaterialRequest {
    fullname: string;
    phone_number: string;
    company: string;
    notes?: string;
    logo_url?: string;
    image_urls?: string[];
}

export interface UpdateMaterialRequest {
    fullname?: string;
    phone_number?: string;
    company?: string;
    notes?: string;
    logo_url?: string;
    image_urls?: string[];
}
