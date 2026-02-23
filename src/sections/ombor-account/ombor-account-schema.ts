import { z } from 'zod';

import { OmborAccountRole } from 'src/types/ombor-account';

export const getOmborAccountFormSchema = (t: (key: string) => string, isUpdate: boolean) =>
    z.object({
        login: z.string().min(1, t('login_required')),
        password: isUpdate
            ? z.string().optional().nullable()
            : z.string().min(1, t('password_required')),
        role: z.nativeEnum(OmborAccountRole, { errorMap: () => ({ message: t('role_required') }) }),
    });

export type OmborAccountFormValues = z.infer<ReturnType<typeof getOmborAccountFormSchema>>;
