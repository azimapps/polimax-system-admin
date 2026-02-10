export type Partner = {
    id: number;
    version: number;
    fullname: string;
    phone_number: string;
    company: string;
    notes: string;
    categories: string[];
    logo_url: string;
    image_urls: string[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    archived_at: string | null;
    created_by: number;
    archived_by: number | null;
    previous_id: number | null;
};

export type PartnerListItem = Pick<Partner, 'id' | 'version' | 'fullname' | 'company' | 'categories' | 'phone_number' | 'logo_url' | 'image_urls'>;

export type CreatePartnerRequest = {
    fullname: string;
    phone_number: string;
    company: string;
    notes?: string;
    categories: string[];
    logo_url?: string;
    image_urls?: string[];
};

export type UpdatePartnerRequest = Partial<CreatePartnerRequest>;
