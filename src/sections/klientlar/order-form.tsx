
import type { Order, CreateOrderRequest, UpdateOrderRequest } from 'src/types/order';

import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import LoadingButton from '@mui/lab/LoadingButton';

import { useGetStaff } from 'src/hooks/use-staff';
import { useGetClients } from 'src/hooks/use-clients';
import { useCreateOrder, useUpdateOrder } from 'src/hooks/use-orders';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { StaffType } from 'src/types/staff';
import { OrderStatus, OrderVtulka, OrderCurrency, OrderMaterial, OrderSubMaterial, OrderNapravlenie } from 'src/types/order';

import { getOrderSchema } from './order-schema';

// ----------------------------------------------------------------------

function NapravlenieIcon({ type, color }: { type: string; color: string }) {
    // Circle (roll) on top, hand-drawn "A" shape below in 4 orientations:
    // type_1: A normal        type_2: A upside down (180°)
    // type_3: A rotated 90° CW   type_4: A rotated 90° CCW

    const rotations: Record<string, number> = {
        type_1: 0,
        type_2: 180,
        type_3: 90,
        type_4: 270,
    };
    const deg = rotations[type] ?? 0;

    return (
        <svg width={82} height={56} viewBox="0 0 82 56" fill="none">
            {/* Upward arrow (strelka) — always points up, on the left */}
            <line x1="18" y1="50" x2="18" y2="10" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
            <path
                d="M8,20 L18,10 L28,20"
                stroke={color}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            {/* "A" drawn as path, rotated around center of A area */}
            <g transform={`rotate(${deg}, 58, 28)`}>
                {/* Two legs */}
                <path
                    d="M46,48 L58,18 L70,48"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
                {/* Crossbar */}
                <line
                    x1="50" y1="37" x2="66" y2="37"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </g>
        </svg>
    );
}

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
            vtulka: order?.vtulka || OrderVtulka.V76,
            napravlenie: order?.napravlenie || OrderNapravlenie.TYPE_1,
        }),
        [order]
    );

    const methods = useForm<CreateOrderRequest>({
        resolver: zodResolver(getOrderSchema(t)),
        defaultValues,
    });

    useEffect(() => {
        if (order) {
            methods.reset(defaultValues);
        }
    }, [order, defaultValues, methods]);

    const { handleSubmit, watch, setValue } = methods;

    const napravlenie = watch('napravlenie' as any);

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

                    <Field.Select name="vtulka" label={t('form.vtulka')} required>
                        {Object.values(OrderVtulka).map((option) => (
                            <MenuItem key={option} value={option}>
                                {t(`form.vtulka_options.${option}`)}
                            </MenuItem>
                        ))}
                    </Field.Select>

                    <Box sx={{ gridColumn: 'span 2' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                            {t('form.napravlenie')} *
                        </Typography>
                        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1.5}>
                            {Object.values(OrderNapravlenie).map((option) => {
                                const isSelected = napravlenie === option;
                                return (
                                    <ButtonBase
                                        key={option}
                                        onClick={() => setValue('napravlenie' as any, option, { shouldValidate: true })}
                                        sx={{
                                            p: 2,
                                            borderRadius: 1.5,
                                            border: '2px solid',
                                            borderColor: isSelected ? 'success.main' : 'divider',
                                            bgcolor: isSelected ? 'success.lighter' : 'background.neutral',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 1,
                                            '&:hover': {
                                                borderColor: isSelected ? 'success.main' : 'text.secondary',
                                                bgcolor: isSelected ? 'success.lighter' : 'action.hover',
                                            },
                                        }}
                                    >
                                        <NapravlenieIcon type={option} color={isSelected ? '#22c55e' : '#919eab'} />
                                        <Typography
                                            variant="caption"
                                            fontWeight={600}
                                            sx={{ color: isSelected ? 'success.darker' : 'text.secondary' }}
                                        >
                                            {t(`form.napravlenie_options.${option}`)}
                                        </Typography>
                                    </ButtonBase>
                                );
                            })}
                        </Box>
                    </Box>

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
