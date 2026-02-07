import { z as zod } from 'zod';

// Phone validation for Uzbekistan format: +998 XX XXX-XX-XX
export const getClientFormSchema = (t: (key: string) => string) =>
  zod.object({
    fullname: zod.string().min(1, t('fullname_required')),
    phone_number: zod
      .string()
      .min(1, t('phone_required'))
      .refine(
        (val) => {
          // Remove all non-digit characters
          const digits = val.replace(/\D/g, '');
          // Check if it starts with 998 and has exactly 12 digits (998 + 9 digits)
          return digits.startsWith('998') && digits.length === 12;
        },
        { message: t('phone_error') }
      ),
    company: zod.string().optional(),
    notes: zod.string().optional(),
    profile_url: zod.string().optional(),
    image_urls: zod.array(zod.string()).optional(),
  });

export type ClientFormValues = zod.infer<ReturnType<typeof getClientFormSchema>>;
