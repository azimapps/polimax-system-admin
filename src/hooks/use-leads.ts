import type {
    CreateLeadRequest,
    UpdateLeadRequest,
    CreateLeadConversationRequest,
} from 'src/types/lead';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { leadApi } from 'src/api/lead-api';

// ----------------------------------------------------------------------

const QUERY_KEYS = {
    leads: ['leads'],
    lead: (id: number) => ['lead', id],
    archived: ['leads', 'archived'],
    history: (id: number) => ['lead', id, 'history'],
    conversations: (id: number) => ['lead', id, 'conversations'],
};

// ----------------------------------------------------------------------

export function useGetLeads(params?: { q?: string; status?: string }) {
    return useQuery({
        queryKey: [...QUERY_KEYS.leads, params],
        queryFn: () => leadApi.getLeads(params),
    });
}

export function useGetLead(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.lead(id),
        queryFn: () => leadApi.getLead(id),
        enabled: !!id,
    });
}

export function useCreateLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateLeadRequest) => leadApi.createLead(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leads });
        },
    });
}

export function useUpdateLead(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateLeadRequest) => leadApi.updateLead(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leads });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lead(id) });
        },
    });
}

export function useDeleteLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => leadApi.deleteLead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leads });
        },
    });
}

export function useGetArchivedLeads(q?: string) {
    return useQuery({
        queryKey: [...QUERY_KEYS.archived, { q }],
        queryFn: () => leadApi.getArchivedLeads(q),
    });
}

export function useRestoreLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => leadApi.restoreLead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leads });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archived });
        },
    });
}

export function useGetLeadHistory(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.history(id),
        queryFn: () => leadApi.getLeadHistory(id),
        enabled: id > 0,
    });
}

export function useRevertLead(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (version: number) => leadApi.revertLead(id, version),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leads });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lead(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history(id) });
        },
    });
}

export function useGetLeadConversations(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.conversations(id),
        queryFn: () => leadApi.getConversations(id),
        enabled: id > 0,
    });
}

export function useAddLeadConversation(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateLeadConversationRequest) => leadApi.addConversation(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversations(id) });
        },
    });
}

export function useDeleteLeadConversation(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (conversationId: number) => leadApi.deleteConversation(id, conversationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversations(id) });
        },
    });
}
