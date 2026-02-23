export enum OmborAccountRole {
    PLYONKA = 'ombor_plyonka',
    KRASKA = 'ombor_kraska',
    SUYUQ_KRASKA = 'ombor_suyuq_kraska',
    RASTVARITEL = 'ombor_rastvaritel',
    RASTVARITEL_ARALASHMA = 'ombor_rastvaritel_aralashma',
    KLEY = 'ombor_kley',
    SILINDR = 'ombor_silindr',
    ZAPCHAST = 'ombor_zapchast',
    TAYYOR_MAHSULOT_TOSHKENT = 'ombor_tayyor_mahsulotlar_toshkent',
    TAYYOR_MAHSULOT_ANGREN = 'ombor_tayyor_mahsulotlar_angren',
}

export interface OmborAccount {
    id: number;
    version: number;
    login: string;
    role: OmborAccountRole;
    fullname: string | null;
    avatar_url: string | null;
    staff_id: number | null;
    session_token: string | null;
    last_login_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    archived_at: string | null;
    created_by: number | null;
    archived_by: number | null;
    previous_id: number | null;
}

export interface CreateOmborAccountRequest {
    login: string;
    password?: string;
    role: OmborAccountRole;
}

export interface UpdateOmborAccountRequest {
    login?: string;
    password?: string;
}
