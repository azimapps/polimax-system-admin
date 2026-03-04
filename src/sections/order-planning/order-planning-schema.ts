import { z as zod } from 'zod';

export function getPlanItemSchema(t: any): any {
    return zod.object({
        order_id: zod.number().min(1, { message: t('required') }),
        plan_type: zod.string().min(1, { message: t('required') }),
        brigada_id: zod.number().min(1, { message: t('required') }),
        machine_id: zod.number().min(1, { message: t('required') }),
        machine_type: zod.string().optional(),
        start_date: zod.string().min(1, { message: t('required') }),
        end_date: zod.string().min(1, { message: t('required') }),
        status: zod.string().optional(),
    });
}
