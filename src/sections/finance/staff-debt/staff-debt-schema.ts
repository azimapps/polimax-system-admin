import { z as zod } from 'zod';

export const getStaffDebtSchema = () =>
    zod.object({
        staff_id: zod.number().min(1, 'Xodimni tanlang'),
        amount: zod.number().min(0.01, 'Summa noldan katta bo\'lishi kerak'),
        reason: zod.enum(['avans', 'qarz', 'boshqa'], {
            required_error: 'Sababni tanlang',
        }),
        date: zod.string().min(1, 'Sanani kiriting'),
        notes: zod.string().optional(),
    });

export const getStaffDebtPaymentSchema = () =>
    zod.object({
        amount: zod.number().min(0.01, 'Summa noldan katta bo\'lishi kerak'),
        payment_method: zod.enum(['naqd', 'bank', 'salary_deduction'], {
            required_error: 'To\'lov turini tanlang',
        }),
        date: zod.string().min(1, 'Sanani kiriting'),
        notes: zod.string().optional(),
    });
