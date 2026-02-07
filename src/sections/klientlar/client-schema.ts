import { z as zod } from 'zod';

// Phone validation for Uzbekistan format: +998 XX XXX-XX-XX
export const ClientFormSchema = zod.object({
    fullname: zod.string().min(1, 'fullname_required'),
    phone_number: zod
        .string()
        .min(1, 'phone_required')
        .refine(
            (val) => {
                // Remove all non-digit characters
                const digits = val.replace(/\D/g, '');
                // Check if it starts with 998 and has exactly 12 digits (998 + 9 digits)
                return digits.startsWith('998') && digits.length === 12;
            },
            { message: 'phone_error' }
        ),
    company: zod.string().optional(),
    notes: zod.string().optional(),
    profile_url: zod.string().optional(),
    image_urls: zod.array(zod.string()).optional(),
});

export type ClientFormValues = zod.infer<typeof ClientFormSchema>;
