import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { salaryApi } from 'src/api/salary-api';

// ----------------------------------------------------------------------

const QUERY_KEYS = {
    preview: (year: number, month: number) => ['salary', 'preview', year, month],
    list: ['salary', 'list'],
    staffDetail: (id: number) => ['salary', 'staff', id],
};

// ----------------------------------------------------------------------

export function useGetSalaryPreview(year: number, month: number, staff_id?: number) {
    return useQuery({
        queryKey: [...QUERY_KEYS.preview(year, month), { staff_id }],
        queryFn: () => salaryApi.preview(year, month, staff_id),
        enabled: !!year && !!month,
    });
}

export function useGetSalaryRecords(params?: {
    year?: number;
    month?: number;
    status?: string;
    staff_type?: string;
}) {
    return useQuery({
        queryKey: [...QUERY_KEYS.list, params],
        queryFn: () => salaryApi.list(params),
    });
}

export function useGetStaffSalaryDetail(staffId: number, year?: number, includePreview?: boolean) {
    return useQuery({
        queryKey: [...QUERY_KEYS.staffDetail(staffId), { year, includePreview }],
        queryFn: () => salaryApi.staffDetail(staffId, year, includePreview),
        enabled: staffId > 0,
    });
}

export function useConfirmSalary() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ year, month, staff_ids }: { year: number; month: number; staff_ids?: number[] }) =>
            salaryApi.confirm(year, month, staff_ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['salary'] });
        },
    });
}

export function usePaySalary() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            salary_record_ids,
            payment_method,
            notes,
        }: {
            salary_record_ids: number[];
            payment_method: string;
            notes?: string;
        }) => salaryApi.pay(salary_record_ids, payment_method, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['salary'] });
        },
    });
}
