
import { z } from 'zod';

import { StanokType } from 'src/types/stanok';

export const getStanokFormSchema = (t: (key: string) => string) =>
    z.object({
        name: z.string().min(1, t('name_required')),
        country_code: z
            .string()
            .min(2, t('country_code_required'))
            .max(2, t('country_code_required'))
            .toUpperCase(),
        type: z.nativeEnum(StanokType, { errorMap: () => ({ message: t('type_required') }) }),
    });

export type StanokFormValues = z.infer<ReturnType<typeof getStanokFormSchema>>;
