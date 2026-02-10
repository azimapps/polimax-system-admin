
import { z } from 'zod';

import { OmborCategory } from 'src/types/ombor';

export const getOmborSchema = (t: any) =>
    z.object({
        name: z.string().min(1, { message: t('required') }),
        category: z.array(z.nativeEnum(OmborCategory)).min(1, { message: t('required') }),
        quantity: z.number().min(0),
        unit: z.string().min(1),
        price: z.number().min(0),
        currency: z.enum(['uzs', 'usd']),
        batch_number: z.string().optional(),
        notes: z.string().optional(),
    });
