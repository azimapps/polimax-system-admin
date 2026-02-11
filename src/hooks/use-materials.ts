import type { CreateMaterialRequest, UpdateMaterialRequest } from 'src/types/material';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { materialApi } from 'src/api/material-api';

// ----------------------------------------------------------------------

const QUERY_KEYS = {
    materials: ['materials'],
    material: (id: number) => ['material', id],
    archived: ['materials', 'archived'],
    history: (id: number) => ['material', id, 'history'],
};

// ----------------------------------------------------------------------

export function useGetMaterials(q?: string) {
    return useQuery({
        queryKey: [...QUERY_KEYS.materials, { q }],
        queryFn: () => materialApi.getMaterials(q),
    });
}

export function useGetMaterial(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.material(id),
        queryFn: () => materialApi.getMaterial(id),
        enabled: !!id,
    });
}

export function useCreateMaterial() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateMaterialRequest) => materialApi.createMaterial(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.materials });
        },
    });
}

export function useUpdateMaterial(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateMaterialRequest) => materialApi.updateMaterial(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.materials });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.material(id) });
        },
    });
}

export function useDeleteMaterial() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => materialApi.deleteMaterial(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.materials });
        },
    });
}

export function useGetArchivedMaterials(q?: string) {
    return useQuery({
        queryKey: [...QUERY_KEYS.archived, { q }],
        queryFn: () => materialApi.getArchivedMaterials(q),
    });
}

export function useRestoreMaterial() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => materialApi.restoreMaterial(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.materials });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archived });
        },
    });
}

export function useGetMaterialHistory(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.history(id),
        queryFn: () => materialApi.getMaterialHistory(id),
        enabled: id > 0,
    });
}

export function useRevertMaterial(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (version: number) => materialApi.revertMaterial(id, version),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.materials });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.material(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history(id) });
        },
    });
}
