
import type { Order, CreateOrderRequest, UpdateOrderRequest } from 'src/types/order';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';

import { useGetStaff } from 'src/hooks/use-staff';
import { useGetClients } from 'src/hooks/use-clients';
import { useCreateOrder, useUpdateOrder } from 'src/hooks/use-orders';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { StaffType } from 'src/types/staff';
import { OrderStatus, OrderCurrency, OrderMaterial, OrderSubMaterial } from 'src/types/order';

import { getOrderSchema } from './order-schema';

// ----------------------------------------------------------------------

type Props = {
    order?: Order;
    onSuccess?: () => void;
};

export function OrderBookForm({ order, onSuccess }: Props) {
    const { t } = useTranslate('order');
    const isEdit = !!order;

    const { data: clients = [] } = useGetClients();
    const { data: staffData = [] } = useGetStaff(undefined, StaffType.CRM);
    const { mutateAsync: createOrder, isPending: isCreating } = useCreateOrder();
    const { mutateAsync: updateOrder, isPending: isUpdating } = useUpdateOrder(order?.id || 0);

    const isPending = isCreating || isUpdating;

    const defaultValues = useMemo(
        () => ({
            order_number: order?.order_number || '',
            date: order?.date || new Date().toISOString(),
            title: order?.title || '',
            client_id: order?.client_id || 0,
            quantity_kg: order?.quantity_kg || 0,
            material: order?.material || OrderMaterial.BOPP,
            sub_material: order?.sub_material || OrderSubMaterial.PRAZRACHNIY,
            film_thickness: order?.film_thickness || 0,
            film_width: order?.film_width || 0,
            cylinder_length: order?.cylinder_length || 0,
            cylinder_count: order?.cylinder_count || 0,
            cylinder_aylanasi: order?.cylinder_aylanasi || 0,
            start_date: order?.start_date || new Date().toISOString(),
            end_date: order?.end_date || new Date().toISOString(),
            price_per_kg: order?.price_per_kg || 0,
            price_currency: order?.price_currency || OrderCurrency.UZS,
            manager_id: order?.manager_id || 0,
            status: order?.status || OrderStatus.IN_PROGRESS,
        }),
        [order]
    );

    const methods = useForm<CreateOrderRequest>({
        resolver: zodResolver(getOrderSchema(t)),
        defaultValues,
    });

    const { handleSubmit } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (isEdit) {
                await updateOrder(data as UpdateOrderRequest);
                toast.success(t('messages.success_update'));
            } else {
                await createOrder(data);
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
            <Stack spacing={3} sx={{ pt: 2 }}>
                <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                    }}
                >
                    <Field.Text name="order_number" label={t('form.order_number')} required />
                    <Field.DatePicker name="date" label={t('form.date')} />
                    <Field.Text name="title" label={t('form.title')} sx={{ gridColumn: 'span 2' }} required />

                    <Field.Select name="client_id" label={t('form.client')} required>
                        <MenuItem value={0}>None</MenuItem>
                        {clients.map((client) => (
                            <MenuItem key={client.id} value={client.id}>
                                {client.fullname} {client.company ? `(${client.company})` : ''}
                            </MenuItem>
                        ))}
                    </Field.Select>

                    <Field.Text name="quantity_kg" label={t('form.quantity_kg')} type="number" required />

                    <Field.Select name="material" label={t('form.material')} required>
                        {Object.values(OrderMaterial).map((option) => (
                            <MenuItem key={option} value={option}>
                                {option.toUpperCase()}
                            </MenuItem>
                        ))}
                    </Field.Select>

                    <Field.Select name="sub_material" label={t('form.sub_material')} required>
                        {Object.values(OrderSubMaterial).map((option) => (
                            <MenuItem key={option} value={option}>
                                {t(`form.sub_material_options.${option}`, { defaultValue: option.toUpperCase().replace('_', ' ') })}
                            </MenuItem>
                        ))}
                    </Field.Select>

                    <Field.Text name="film_thickness" label={t('form.film_thickness')} type="number" required />
                    <Field.Text name="film_width" label={t('form.film_width')} type="number" required />
                    <Field.Text name="cylinder_length" label={t('form.cylinder_length')} type="number" required />
                    <Field.Text name="cylinder_count" label={t('form.cylinder_count')} type="number" required />
                    <Field.Text name="cylinder_aylanasi" label={t('form.cylinder_aylanasi')} type="number" required />

                    <Field.DatePicker name="start_date" label={t('form.start_date')} />
                    <Field.DatePicker name="end_date" label={t('form.end_date')} />

                    <Field.Text name="price_per_kg" label={t('form.price_per_kg')} type="number" required />
                    <Field.Select name="price_currency" label={t('form.price_currency')} required>
                        {Object.values(OrderCurrency).map((option) => (
                            <MenuItem key={option} value={option}>
                                {option.toUpperCase()}
                            </MenuItem>
                        ))}
                    </Field.Select>

                    <Field.Select name="manager_id" label={t('form.manager')} required>
                        <MenuItem value={0}>None</MenuItem>
                        {staffData.map((staff) => (
                            <MenuItem key={staff.id} value={staff.id}>
                                {staff.fullname}
                            </MenuItem>
                        ))}
                    </Field.Select>

                    <Field.Select name="status" label={t('form.status')} required>
                        {Object.values(OrderStatus).map((option) => (
                            <MenuItem key={option} value={option}>
                                {t(`form.status_options.${option}`)}
                            </MenuItem>
                        ))}
                    </Field.Select>
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                    <Button variant="outlined" color="inherit" onClick={onSuccess}>
                        {t('cancel')}
                    </Button>
                    <LoadingButton type="submit" variant="contained" loading={isPending}>
                        {isEdit ? t('update') : t('create')}
                    </LoadingButton>
                </Stack>
            </Stack>
        </Form>
    );
}
