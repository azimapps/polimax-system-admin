
export enum OmborType {
    PLYONKA = 'plyonka',
    KRASKA = 'kraska',
    SUYUQ_KRASKA = 'suyuq_kraska',
    RASTVARITEL = 'rastvaritel',
    ARALASHMASI = 'aralashmasi',
    SILINDIR = 'silindr',
    KLEY = 'kley',
    ZAPCHASTLAR = 'zapchastlar',
    OTXOT = 'otxot',
    TAYYOR_TOSHKENT = 'tayyor_toshkent',
    TAYYOR_ANGREN = 'tayyor_angren',
}

export enum PriceCurrency {
    UZS = 'uzs',
    USD = 'usd',
    RUB = 'rub',
    EUR = 'eur',
}

export enum PlyonkaCategory {
    BOPP = 'bopp',
    CPP = 'cpp',
    PE = 'pe',
    PET = 'pet',
    TVIST = 'tvist',
}

export enum SolventType {
    EAF = 'eaf',
    EA = 'ea',
    METOKSIL = 'metoksil',
}

export enum CylinderOrigin {
    CHINA = 'china',
    GERMANY = 'germany',
}

export type OmborItem = {
    id: number;
    version: number;
    ombor_type: OmborType;
    name: string;
    date: string;
    description?: string;
    price_currency: PriceCurrency;
    supplier_id?: number | null;
    client_id?: number | null;
    davaldiylik_id?: number | null;
    total_kg?: number | null;
    total_liter?: number | null;
    quantity?: number | null;
    barrels?: number | null;
    price_per_kg?: number | null;
    price_per_liter?: number | null;
    price?: number | null;
    seriya_number?: string | null;
    number_identifier?: string | null;
    plyonka_category?: PlyonkaCategory | null;
    plyonka_subcategory?: string | null;
    thickness?: number | null;
    width?: number | null;
    color_name?: string | null;
    color_hex?: string | null;
    marka?: string | null;
    solvent_type?: SolventType | null;
    eaf_component_id?: number | null;
    eaf_component_quantity?: number | null;
    etilin_component_id?: number | null;
    etilin_component_quantity?: number | null;
    metoksil_component_id?: number | null;
    metoksil_component_quantity?: number | null;
    origin?: CylinderOrigin | null;
    length?: number | null;
    diameter?: number | null;
    usage?: number | null;
    usage_limit?: number | null;
    product_type?: string | null;
    net_weight?: number | null;
    gross_weight?: number | null;
    total_net_weight?: number | null;
    total_gross_weight?: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    archived_at: string | null;
    created_by?: number | null;
    archived_by?: number | null;
    previous_id: number | null;
};

export type CreateOmborRequest = any; // Simplifying for now to resolve complex union mismatch

export type UpdateOmborRequest = Partial<OmborItem>;

export enum OmborTransactionType {
    KIRIM = 'kirim',
    CHIQIM = 'chiqim'
}

export type OmborTransaction = {
    id: number;
    version: number;
    ombor_item_id: number;
    transaction_type: OmborTransactionType;
    date: string;
    quantity_kg?: number | null;
    quantity_liter?: number | null;
    quantity_count?: number | null;
    quantity_barrels?: number | null;
    notes?: string | null;
    plan_item_id?: number | null;
    stanok_id?: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    archived_at: string | null;
    created_by?: number | null;
    archived_by?: number | null;
    previous_id: number | null;
};

export type CreateOmborTransactionRequest = {
    transaction_type: OmborTransactionType;
    date: string;
    quantity_kg?: number | null;
    quantity_liter?: number | null;
    quantity_count?: number | null;
    quantity_barrels?: number | null;
    notes?: string | null;
    plan_item_id?: number | null;
    stanok_id?: number | null;
};

