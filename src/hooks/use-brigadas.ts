import type { CreateBrigadaRequest, UpdateBrigadaRequest, CreateBrigadaMemberRequest, UpdateBrigadaMemberRequest } from 'src/types/brigada';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { brigadaApi } from 'src/api/brigada-api';

const BRIGADA_KEYS = {
    all: ['brigadas'] as const,
    lists: () => [...BRIGADA_KEYS.all, 'list'] as const,
    list: (params: any) => [...BRIGADA_KEYS.lists(), params] as const,
    details: () => [...BRIGADA_KEYS.all, 'detail'] as const,
    detail: (id: number) => [...BRIGADA_KEYS.details(), id] as const,
    archived: () => [...BRIGADA_KEYS.all, 'archived'] as const,
    history: (id: number) => [...BRIGADA_KEYS.all, 'history', id] as const,
    members: (brigadaId: number) => [...BRIGADA_KEYS.detail(brigadaId), 'members'] as const,
    member: (brigadaId: number, memberId: number) => [...BRIGADA_KEYS.members(brigadaId), memberId] as const,
};

// Brigada Hooks
export function useGetBrigadas(params?: { q?: string; machine_type?: string }) {
    return useQuery({
        queryKey: BRIGADA_KEYS.list(params),
        queryFn: () => brigadaApi.getBrigadas(params),
    });
}

export function useGetBrigada(id: number) {
    return useQuery({
        queryKey: BRIGADA_KEYS.detail(id),
        queryFn: () => brigadaApi.getBrigada(id),
        enabled: !!id,
    });
}

export function useCreateBrigada() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateBrigadaRequest) => brigadaApi.createBrigada(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BRIGADA_KEYS.lists() });
        },
    });
}

export function useUpdateBrigada(id: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateBrigadaRequest) => brigadaApi.updateBrigada(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BRIGADA_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: BRIGADA_KEYS.detail(id) });
        },
    });
}

export function useDeleteBrigada() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => brigadaApi.deleteBrigada(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BRIGADA_KEYS.lists() });
        },
    });
}

export function useGetArchivedBrigadas(params?: { q?: string }) {
    return useQuery({
        queryKey: BRIGADA_KEYS.archived(),
        queryFn: () => brigadaApi.getArchivedBrigadas(params),
    });
}

export function useRestoreBrigada() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => brigadaApi.restoreBrigada(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BRIGADA_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: BRIGADA_KEYS.archived() });
        },
    });
}

export function useGetBrigadaHistory(id: number) {
    return useQuery({
        queryKey: BRIGADA_KEYS.history(id),
        queryFn: () => brigadaApi.getBrigadaHistory(id),
        enabled: !!id,
    });
}

export function useRevertBrigada(id: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (version: number) => brigadaApi.revertBrigada(id, version),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BRIGADA_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: BRIGADA_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: BRIGADA_KEYS.history(id) });
        },
    });
}

// Brigada Member Hooks
export function useGetBrigadaMembers(brigadaId: number) {
    return useQuery({
        queryKey: BRIGADA_KEYS.members(brigadaId),
        queryFn: () => brigadaApi.getBrigadaMembers(brigadaId),
        enabled: !!brigadaId,
    });
}

export function useAddBrigadaMember(brigadaId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateBrigadaMemberRequest) => brigadaApi.addBrigadaMember(brigadaId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BRIGADA_KEYS.members(brigadaId) });
        },
    });
}

export function useUpdateBrigadaMember(brigadaId: number, memberId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateBrigadaMemberRequest) => brigadaApi.updateBrigadaMember(brigadaId, memberId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BRIGADA_KEYS.members(brigadaId) });
            queryClient.invalidateQueries({ queryKey: BRIGADA_KEYS.member(brigadaId, memberId) });
        },
    });
}

export function useDeleteBrigadaMember(brigadaId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (memberId: number) => brigadaApi.deleteBrigadaMember(brigadaId, memberId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BRIGADA_KEYS.members(brigadaId) });
        },
    });
}


export function useGetAssignedWorkers(machine_type?: string) {
    const [assignedLeaders, setAssignedLeaders] = useState<Set<string>>(new Set());
    const [assignedMembers, setAssignedMembers] = useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function fetchAssignments() {
            setIsLoading(true);
            try {
                const brigadas = await brigadaApi.getBrigadas({ machine_type });

                const leaders = new Set<string>();
                brigadas.forEach((b: any) => {
                    if (b.leader) {
                        leaders.add(b.leader);
                    }
                });

                const membersPromises = brigadas.map((b: any) => brigadaApi.getBrigadaMembers(b.id));
                const allMembersResult = await Promise.all(membersPromises);

                const members = new Set<number>();
                allMembersResult.forEach((memberGroup: any) => {
                    memberGroup.forEach((m: any) => members.add(m.worker_id));
                });

                if (isMounted) {
                    setAssignedLeaders(leaders);
                    setAssignedMembers(members);
                }
            } catch (error) {
                console.error("Failed to fetch assigned workers", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        if (machine_type) {
            fetchAssignments();
        }

        return () => {
            isMounted = false;
        };
    }, [machine_type]);

    return { assignedLeaders, assignedMembers, isLoading };
}
