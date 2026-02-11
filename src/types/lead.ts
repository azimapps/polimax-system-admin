export interface Lead {
    id: number;
    version: number;
    fullname: string;
    phone_number: string;
    company: string | null;
    notes: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    archived_at: string | null;
    created_by: number;
    archived_by: number | null;
    previous_id: number | null;
}

export interface LeadListItem {
    id: number;
    version: number;
    fullname: string;
    phone_number: string;
    company: string | null;
    status: string;
}

export interface CreateLeadRequest {
    fullname: string;
    phone_number: string;
    company: string;
    notes?: string;
    status: string;
}

export interface UpdateLeadRequest {
    fullname?: string;
    phone_number?: string;
    company?: string;
    notes?: string;
    status?: string;
}

export interface LeadConversation {
    id: number;
    lead_id: number;
    message: string;
    noted_by: number;
    created_at: string;
}

export interface CreateLeadConversationRequest {
    message: string;
}
