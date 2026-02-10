
import type {
    StaffType,
    WorkerType,
    AccountantType,
    CreateStaffRequest,
    UpdateStaffRequest,
} from 'src/types/staff';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { staffApi } from 'src/api/staff-api';

// ----------------------------------------------------------------------

const QUERY_KEYS = {
    staffList: ['staff'],
    staff: (id: number) => ['staff', id],
    archived: ['staff', 'archived'],
    history: (id: number) => ['staff', id, 'history'],
};

// ----------------------------------------------------------------------

export function useGetStaff(q?: string, type?: StaffType, worker_type?: WorkerType, accountant_type?: AccountantType) {
    return useQuery({
        queryKey: [...QUERY_KEYS.staffList, { q, type, worker_type, accountant_type }],
        queryFn: () => staffApi.getStaff(q, type, worker_type, accountant_type),
    });
}

export function useGetStaffMember(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.staff(id),
        queryFn: () => staffApi.getStaffMember(id),
        enabled: !!id,
    });
}

export function useCreateStaff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateStaffRequest) => staffApi.createStaff(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffList });
        },
    });
}

export function useUpdateStaff(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateStaffRequest) => staffApi.updateStaff(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffList });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staff(id) });
        },
    });
}

export function useDeleteStaff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => staffApi.deleteStaff(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffList });
        },
    });
}

export function useGetArchivedStaff(q?: string) {
    return useQuery({
        queryKey: [...QUERY_KEYS.archived, { q }],
        queryFn: () => staffApi.getArchivedStaff(q),
    });
}

export function useRestoreStaff() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => staffApi.restoreStaff(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffList });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archived });
        },
    });
}

export function useGetStaffHistory(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.history(id),
        queryFn: () => staffApi.getStaffHistory(id),
        enabled: id > 0,
    });
}

export function useRevertStaff(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (version: number) => staffApi.revertStaff(id, version),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staffList });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staff(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history(id) });
        },
    });
}
