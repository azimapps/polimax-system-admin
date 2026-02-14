import type { ExpenseQueryParams, CreateExpenseRequest, UpdateExpenseRequest } from 'src/types/expense';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { expenseApi } from 'src/api/expense-api';

// ----------------------------------------------------------------------

const QUERY_KEYS = {
    expenses: ['expenses'],
    expense: (id: number) => ['expense', id],
    archived: ['expenses', 'archived'],
    history: (id: number) => ['expense', id, 'history'],
};

// ----------------------------------------------------------------------

export function useGetExpenses(params?: ExpenseQueryParams) {
    return useQuery({
        queryKey: [...QUERY_KEYS.expenses, params],
        queryFn: () => expenseApi.getExpenses(params),
    });
}

export function useGetExpense(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.expense(id),
        queryFn: () => expenseApi.getExpense(id),
        enabled: !!id,
    });
}

export function useCreateExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateExpenseRequest) => expenseApi.createExpense(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses });
        },
    });
}

export function useUpdateExpense(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateExpenseRequest) => expenseApi.updateExpense(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expense(id) });
        },
    });
}

export function useDeleteExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => expenseApi.deleteExpense(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses });
        },
    });
}

export function useGetArchivedExpenses(q?: string) {
    return useQuery({
        queryKey: [...QUERY_KEYS.archived, { q }],
        queryFn: () => expenseApi.getArchivedExpenses(q),
    });
}

export function useRestoreExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => expenseApi.restoreExpense(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archived });
        },
    });
}

export function useGetExpenseHistory(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.history(id),
        queryFn: () => expenseApi.getExpenseHistory(id),
        enabled: id > 0,
    });
}

export function useRevertExpense(id: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (version: number) => expenseApi.revertExpense(id, version),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expenses });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.expense(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history(id) });
        },
    });
}
