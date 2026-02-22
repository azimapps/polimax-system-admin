import type { PlanItem, CreatePlanItemRequest, UpdatePlanItemRequest } from 'src/types/plan-item';

import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';

import { useGetOrders } from 'src/hooks/use-orders';
import { useGetStanoklar } from 'src/hooks/use-stanok';
import { useGetBrigadas } from 'src/hooks/use-brigadas';
import { useCreatePlanItem, useUpdatePlanItem } from 'src/hooks/use-plan-items';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { StanokType } from 'src/types/stanok';

import { getPlanItemSchema } from './order-planning-schema';

// ----------------------------------------------------------------------

type Props = {
    planItem?: PlanItem;
    onSuccess?: () => void;
};

export function OrderPlanningForm({ planItem, onSuccess }: Props) {
    const { t } = useTranslate('order-planning');
    const { t: tStanok } = useTranslate('stanok');
    const isEdit = !!planItem;

    const { mutateAsync: createPlanItem, isPending: isCreating } = useCreatePlanItem();
    const { mutateAsync: updatePlanItem, isPending: isUpdating } = useUpdatePlanItem(planItem?.id || 0);

    const { data: orders = [] } = useGetOrders();
    const { data: stanoks = [] } = useGetStanoklar();
    const { data: brigadas = [] } = useGetBrigadas();

    const isPending = isCreating || isUpdating;

    const defaultValues = useMemo(
        () => ({
            order_id: planItem?.order_id || 0,
            machine_type: planItem?.machine?.type || '',
            machine_id: planItem?.machine_id || 0,
            brigada_id: planItem?.brigada_id || 0,
            start_date: planItem?.start_date || '',
            end_date: planItem?.end_date || '',
            status: planItem?.status || 'in_progress',
        }),
        [planItem]
    );

    const methods = useForm<CreatePlanItemRequest>({
        resolver: zodResolver(getPlanItemSchema(t)),
        defaultValues: defaultValues as any,
    });

    const { handleSubmit, watch, setValue } = methods;

    const values = watch();
    const machineType = (values as any).machine_type;
    const machineId = values.machine_id;

    useEffect(() => {
        if (!isEdit && machineType) {
            setValue('machine_id', 0);
            setValue('brigada_id', 0);
        }
    }, [machineType, isEdit, setValue]);

    useEffect(() => {
        if (!isEdit && machineId) {
            setValue('brigada_id', 0);
        }
    }, [machineId, isEdit, setValue]);

    const filteredStanoks = useMemo(() => {
        if (!machineType) return [];
        return stanoks.filter((m) => m.type === machineType);
    }, [stanoks, machineType]);

    const filteredBrigadas = useMemo(() => {
        if (!machineId) return [];
        return brigadas.filter((b) => b.machine_id === machineId);
    }, [brigadas, machineId]);

    const onSubmit = handleSubmit(async (data: any) => {
        try {
            if (isEdit) {
                await updatePlanItem(data as UpdatePlanItemRequest);
                toast.success(t('messages.success_update'));
            } else {
                await createPlanItem(data as CreatePlanItemRequest);
                toast.success(t('messages.success_create'));
            }
            onSuccess?.();
        } catch (error) {
            console.error(error);
            toast.error(t('messages.error_generic'));
        }
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3} sx={{ pt: 1 }}>
                <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(1, 1fr)',
                    }}
                >
                    <Field.Select name="order_id" label={t('form.order')} required>
                        <MenuItem value={0}>{t('form.order')}</MenuItem>
                        {orders.map((o) => (
                            <MenuItem key={o.id} value={o.id}>
                                {o.order_number} - {o.title}
                            </MenuItem>
                        ))}
                    </Field.Select>

                    <Field.Select name="machine_type" label={t('form.machine_type')} required>
                        <MenuItem value="">{t('form.machine_type')}</MenuItem>
                        <MenuItem value={StanokType.PECHAT}>{tStanok('type.pechat')}</MenuItem>
                        <MenuItem value={StanokType.RESKA}>{tStanok('type.reska')}</MenuItem>
                        <MenuItem value={StanokType.LAMINATSIYA}>{tStanok('type.laminatsiya')}</MenuItem>
                    </Field.Select>

                    <Field.Select name="machine_id" label={t('form.machine')} required>
                        <MenuItem value={0}>{t('form.machine')}</MenuItem>
                        {filteredStanoks.map((m) => (
                            <MenuItem key={m.id} value={m.id}>
                                {m.name} ({m.type})
                            </MenuItem>
                        ))}
                    </Field.Select>

                    <Field.Select name="brigada_id" label={t('form.brigada')} required>
                        <MenuItem value={0}>{t('form.brigada')}</MenuItem>
                        {filteredBrigadas.map((b) => (
                            <MenuItem key={b.id} value={b.id}>
                                {b.name} ({b.leader})
                            </MenuItem>
                        ))}
                    </Field.Select>

                    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                        <Field.DatePicker name="start_date" label={t('form.start_date')} />
                        <Field.DatePicker name="end_date" label={t('form.end_date')} />
                    </Box>
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" color="inherit" onClick={onSuccess}>
                        {t('form.cancel')}
                    </Button>
                    <LoadingButton type="submit" variant="contained" loading={isPending}>
                        {isEdit ? t('form.update') : t('form.create')}
                    </LoadingButton>
                </Stack>
            </Stack>
        </Form>
    );
}
