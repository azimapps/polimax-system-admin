import { z as zod } from 'zod';

import { PartnerCategory } from 'src/types/partner';

export const getPartnerFormSchema = (t: (key: string) => string) =>
    zod.object({
        fullname: zod.string().min(1, t('fullname_required')),
        phone_number: zod
            .string()
            .min(1, t('phone_required'))
            .refine(
                (val) => {
                    const digits = val.replace(/\D/g, '');
                    return digits.length === 12;
                },
                { message: t('phone_error') }
            ),
        company: zod.string().min(1, t('company_required')),
        notes: zod.string().optional(),
        categories: zod.array(zod.nativeEnum(PartnerCategory)).min(1, t('categories_required')),
        logo_url: zod.string().optional(),
        image_urls: zod.array(zod.string()).optional(),
    });

export type PartnerFormValues = zod.infer<ReturnType<typeof getPartnerFormSchema>>;
