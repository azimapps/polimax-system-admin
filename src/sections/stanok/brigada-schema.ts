
import { z } from 'zod';

import { StanokType } from 'src/types/stanok';

// ----------------------------------------------------------------------

export const getBrigadaSchema = (t: any) =>
    z.object({
        name: z.string().min(1, { message: t('required') }),
        leader: z.string().optional(),
        leader_id: z.number().optional(),
        machine_id: z.number().optional(),
        machine_type: z.nativeEnum(StanokType, { required_error: t('required') }),
    });

export const getBrigadaMemberSchema = (t: any) =>
    z.object({
        worker_id: z.number().min(1, { message: t('required') }),
        position: z.string().min(1, { message: t('required') }),
    });
