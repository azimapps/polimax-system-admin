export type ClientTransaction = {
    id: number;
    version: number;
    client_id: number;
    value: number;
    currency_exchange_rate: number;
    date: string;
    notes: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    archived_at: string | null;
    created_by: number;
    archived_by: number | null;
    previous_id: number | null;
};

export type ClientTransactionListItem = Pick<
    ClientTransaction,
    'id' | 'version' | 'client_id' | 'value' | 'currency_exchange_rate' | 'date' | 'notes'
>;

export type ClientTransactionListResponse = {
    total: number;
    items: ClientTransactionListItem[];
};

export type CreateClientTransactionRequest = {
    value: number;
    currency_exchange_rate: number;
    date: string;
    notes?: string;
};

export type UpdateClientTransactionRequest = Partial<CreateClientTransactionRequest>;

export type ClientTransactionQueryParams = {
    q?: string;
    date_from?: string;
    date_to?: string;
};
