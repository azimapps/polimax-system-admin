
export enum OmborCategory {
    PLYONKA = 'plyonka',
    KRASKA = 'kraska',
    RASTVARITEL = 'rastvaritel',
    SILINDIR = 'silindir',
    KLEY = 'kley',
}

export type OmborItem = {
    id: number;
    version: number;
    name: string;
    category: OmborCategory[];
    quantity: number;
    unit: string;
    price: number;
    currency: 'uzs' | 'usd';
    batch_number?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    previous_id: number | null;
};

export type CreateOmborRequest = {
    name: string;
    category: OmborCategory[];
    quantity: number;
    unit: string;
    price: number;
    currency: 'uzs' | 'usd';
    batch_number?: string;
    notes?: string;
};

export type UpdateOmborRequest = Partial<CreateOmborRequest>;
