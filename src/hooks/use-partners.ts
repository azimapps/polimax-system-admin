import type { CreatePartnerRequest, UpdatePartnerRequest } from 'src/types/partner';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { partnerApi } from 'src/api/partner-api';

// ----------------------------------------------------------------------

const QUERY_KEYS = {
    partners: ['partners'],
    partner: (id: number) => ['partner', id],
    archived: ['partners', 'archived'],
    history: (id: number) => ['partner', id, 'history'],
};

// ----------------------------------------------------------------------

export function useGetPartners(params?: { q?: string; category?: string }) {
    return useQuery({
        queryKey: [...QUERY_KEYS.partners, params],
        queryFn: () => partnerApi.getPartners(params),
    });
}

export function useGetPartner(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.partner(id),
        queryFn: () => partnerApi.getPartner(id),
        enabled: !!id,
    });
}

export function useCreatePartner() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePartnerRequest) => partnerApi.createPartner(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partners });
        },
    });
}

export function useUpdatePartner(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdatePartnerRequest) => partnerApi.updatePartner(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partners });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partner(id) });
        },
    });
}

export function useDeletePartner() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => partnerApi.deletePartner(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partners });
        },
    });
}

export function useGetArchivedPartners(q?: string) {
    return useQuery({
        queryKey: [...QUERY_KEYS.archived, { q }],
        queryFn: () => partnerApi.getArchivedPartners(q),
    });
}

export function useRestorePartner() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => partnerApi.restorePartner(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partners });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archived });
        },
    });
}

export function useGetPartnerHistory(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.history(id),
        queryFn: () => partnerApi.getPartnerHistory(id),
        enabled: id > 0,
    });
}

export function useRevertPartner(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (version: number) => partnerApi.revertPartner(id, version),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partners });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.partner(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history(id) });
        },
    });
}
