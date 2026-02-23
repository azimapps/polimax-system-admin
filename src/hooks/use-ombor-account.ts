import type { CreateOmborAccountRequest, UpdateOmborAccountRequest } from 'src/types/ombor-account';

import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';
import { omborAccountApi } from 'src/api/ombor-account-api';

const KEYS = {
    all: ['omborAccounts'] as const,
    list: () => [...KEYS.all, 'list'] as const,
    detail: (id: number) => [...KEYS.all, 'detail', id] as const,
};

// ----------------------------------------------------------------------

export function useGetOmborAccounts() {
    return useQuery({
        queryKey: KEYS.list(),
        queryFn: () => omborAccountApi.getAccounts(),
    });
}

// ----------------------------------------------------------------------

export function useGetOmborAccount(id?: number) {
    return useQuery({
        queryKey: KEYS.detail(id!),
        queryFn: () => omborAccountApi.getAccountById(id!),
        enabled: !!id,
    });
}

// ----------------------------------------------------------------------

export function useCreateOmborAccount() {
    const queryClient = useQueryClient();
    const { t } = useTranslate('ombor');

    return useMutation({
        mutationFn: (data: CreateOmborAccountRequest) => omborAccountApi.createAccount(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYS.list() });
            toast.success(t('messages.success_create', { defaultValue: 'Account created successfully' }));
        },
        onError: (error: any) => {
            const message = error?.response?.data?.detail || t('error_generic');
            toast.error(message);
        },
    });
}

// ----------------------------------------------------------------------

export function useUpdateOmborAccount() {
    const queryClient = useQueryClient();
    const { t } = useTranslate('ombor');

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateOmborAccountRequest }) =>
            omborAccountApi.updateAccount(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: KEYS.list() });
            queryClient.invalidateQueries({ queryKey: KEYS.detail(variables.id) });
            toast.success(t('messages.success_update', { defaultValue: 'Account updated successfully' }));
        },
        onError: (error: any) => {
            const message = error?.response?.data?.detail || t('error_generic');
            toast.error(message);
        },
    });
}

// ----------------------------------------------------------------------

export function useDeleteOmborAccount() {
    const queryClient = useQueryClient();
    const { t } = useTranslate('ombor');

    return useMutation({
        mutationFn: (id: number) => omborAccountApi.deleteAccount(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYS.list() });
            toast.success(t('messages.success_delete', { defaultValue: 'Account deleted successfully' }));
        },
        onError: (error: any) => {
            const message = error?.response?.data?.detail || t('error_generic');
            toast.error(message);
        },
    });
}
