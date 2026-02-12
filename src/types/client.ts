export interface Client {
  id: number;
  version: number;
  fullname: string;
  phone_number: string;
  company: string | null;
  notes: string | null;
  profile_url: string | null;
  image_urls: string[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  previous_id: number | null;
}

export interface ClientListItem {
  id: number;
  version: number;
  fullname: string;
  phone_number: string;
  company: string | null;
  profile_url: string | null;
  transactions_total: number;
}

export interface ArchivedClientListItem {
  id: number;
  fullname: string;
  company: string | null;
  deleted_at: string;
  archived_at: string;
  created_by: number;
  archived_by: number;
  profile_url: string | null; // Kept since UI uses it, though not in example.
}

export interface CreateClientRequest {
  fullname: string;
  phone_number: string;
  company?: string;
  notes?: string;
  profile_url?: string;
  image_urls?: string[];
}

export interface UpdateClientRequest {
  fullname?: string;
  phone_number?: string;
  company?: string;
  notes?: string;
  profile_url?: string;
  image_urls?: string[];
}
