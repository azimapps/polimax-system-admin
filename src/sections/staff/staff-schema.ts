
import { z } from 'zod';

import { StaffType, WorkerType, AccountantType } from 'src/types/staff';

// Phone validation for Uzbekistan format: +998 XX XXX-XX-XX
export const getStaffFormSchema = (t: (key: string) => string) =>
    z.object({
        fullname: z.string().min(1, t('fullname_required')),
        phone_number: z
            .string()
            .optional()
            .nullable()
            .refine(
                (val) => {
                    if (!val) return true;
                    const digits = val.replace(/\D/g, '');
                    return digits.length === 12;
                },
                { message: t('phone_error') }
            ),
        notes: z.string().optional().nullable(),
        avatar_url: z.string().optional().nullable(),
        type: z.nativeEnum(StaffType, { errorMap: () => ({ message: t('type_required') }) }),
        accountant_type: z.nativeEnum(AccountantType).optional().nullable(),
        worker_type: z.nativeEnum(WorkerType).optional().nullable(),

        // Salaries
        fixed_salary: z.coerce.number().optional().nullable(),
        worker_fixed_salary: z.coerce.number().optional().nullable(),
        starting_salary: z.coerce.number().optional().nullable(),
        kpi_salary: z.coerce.number().optional().nullable(),
        kpi_tayyor_mahsulotlar_reskasi: z.coerce.number().optional().nullable(),
        kpi_tayyor_mahsulot_peremotkasi: z.coerce.number().optional().nullable(),
        kpi_plyonka_peremotkasi: z.coerce.number().optional().nullable(),
        kpi_3_5_sm_reska: z.coerce.number().optional().nullable(),
        kpi_asobiy_tarif: z.coerce.number().optional().nullable(),
    });

export type StaffFormValues = z.infer<ReturnType<typeof getStaffFormSchema>>;
