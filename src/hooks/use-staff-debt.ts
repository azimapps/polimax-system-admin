import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { staffDebtApi } from 'src/api/staff-debt-api';

import { toast } from 'src/components/snackbar';

export const useGetStaffDebts = (params?: { staff_id?: number; status?: string; reason?: string }) => useQuery({
    queryKey: ['staff-debts', params],
    queryFn: () => staffDebtApi.getDebts(params),
});

export const useGetStaffDebtDetail = (id?: number) => useQuery({
    queryKey: ['staff-debt-detail', id],
    queryFn: () => staffDebtApi.getDebtDetail(id!),
    enabled: !!id,
});

export const useGetStaffDebtSummary = (params?: { staff_id?: number }) => useQuery({
    queryKey: ['staff-debt-summary', params],
    queryFn: () => staffDebtApi.getDebtSummary(params),
});

export const useCreateStaffDebt = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => staffDebtApi.createDebt(data),
        onSuccess: () => {
            toast.success('Qarz / Avans yozildi!');
            queryClient.invalidateQueries({ queryKey: ['staff-debts'] });
            queryClient.invalidateQueries({ queryKey: ['staff-debt-summary'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Xatolik yuz berdi');
        },
    });
};

export const useRecordStaffDebtPayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => staffDebtApi.recordPayment(id, data),
        onSuccess: (_, { id }) => {
            toast.success('To`lov amalga oshirildi!');
            queryClient.invalidateQueries({ queryKey: ['staff-debts'] });
            queryClient.invalidateQueries({ queryKey: ['staff-debt-summary'] });
            queryClient.invalidateQueries({ queryKey: ['staff-debt-detail', id] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Xatolik yuz berdi');
        },
    });
};
