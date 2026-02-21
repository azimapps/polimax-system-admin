
import { z } from 'zod';

import { OrderStatus, OrderCurrency, OrderMaterial, OrderSubMaterial } from 'src/types/order';

// ----------------------------------------------------------------------

export const getOrderSchema = (t: any) =>
    z.object({
        order_number: z.string().min(1, { message: t('required') }),
        date: z.string().min(1, { message: t('required') }),
        title: z.string().min(1, { message: t('required') }),
        client_id: z.number().min(1, { message: t('required') }),
        quantity_kg: z.number().min(0, { message: t('required') }),
        material: z.nativeEnum(OrderMaterial, { required_error: t('required') }),
        sub_material: z.nativeEnum(OrderSubMaterial, { required_error: t('required') }),
        film_thickness: z.number().min(0, { message: t('required') }),
        film_width: z.number().min(0, { message: t('required') }),
        cylinder_length: z.number().min(0, { message: t('required') }),
        cylinder_count: z.number().min(0, { message: t('required') }),
        cylinder_aylanasi: z.number().min(0, { message: t('required') }),
        start_date: z.string().min(1, { message: t('required') }),
        end_date: z.string().min(1, { message: t('required') }),
        price_per_kg: z.number().min(0, { message: t('required') }),
        price_currency: z.nativeEnum(OrderCurrency, { required_error: t('required') }),
        manager: z.string().min(1, { message: t('required') }),
        admin: z.string().min(1, { message: t('required') }),
        number_of_colors: z.number().min(0, { message: t('required') }),
        status: z.nativeEnum(OrderStatus, { required_error: t('required') }),
    });
