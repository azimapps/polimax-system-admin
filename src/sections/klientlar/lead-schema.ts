import { z as zod } from 'zod';

// ----------------------------------------------------------------------

export const LeadSchema = zod.object({
    fullname: zod.string().min(1, { message: 'Fullname is required!' }),
    phone_number: zod.string().min(1, { message: 'Phone number is required!' }),
    company: zod.string().min(1, { message: 'Company is required!' }),
    notes: zod.string().optional(),
    status: zod.string().min(1, { message: 'Status is required!' }),
});

export type LeadSchemaType = zod.infer<typeof LeadSchema>;
