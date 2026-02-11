import type { Lead, CreateLeadRequest, UpdateLeadRequest } from 'src/types/lead';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';

import { useCreateLead, useUpdateLead } from 'src/hooks/use-leads';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { LeadSchema } from './lead-schema';

// ----------------------------------------------------------------------

type Props = {
    lead?: Lead;
    onSuccess?: () => void;
};

export function LeadForm({ lead, onSuccess }: Props) {
    const { t } = useTranslate('lead');
    const isEdit = !!lead;

    const { mutateAsync: createLead, isPending: isCreating } = useCreateLead();
    const { mutateAsync: updateLead, isPending: isUpdating } = useUpdateLead(lead?.id || 0);

    const isPending = isCreating || isUpdating;

    const methods = useForm<CreateLeadRequest>({
        resolver: zodResolver(LeadSchema),
        defaultValues: {
            fullname: lead?.fullname || '',
            phone_number: lead?.phone_number || '',
            company: lead?.company || '',
            notes: lead?.notes || '',
            status: lead?.status || 'yangi',
        },
    });

    const { handleSubmit } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (isEdit) {
                await updateLead(data as UpdateLeadRequest);
                toast.success(t('messages.success_update'));
            } else {
                await createLead(data);
                toast.success(t('messages.success_create'));
            }
            onSuccess?.();
        } catch (error) {
            console.error(error);
            toast.error(t('messages.error_generic'));
        }
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                }}
                sx={{ mt: 2 }}
            >
                <Field.Text name="fullname" label={t('form.fullname')} required />
                <Field.Phone
                    name="phone_number"
                    label={t('form.phone_number')}
                    country="UZ"
                    placeholder={t('phone_placeholder')}
                    InputLabelProps={{ shrink: true }}
                    disableSelect
                    required
                />
                <Field.Text
                    name="company"
                    label={t('form.company')}
                    placeholder={t('form.company')}
                    required
                />
                <Field.Select name="status" label={t('form.status')} required>
                    <MenuItem value="yangi">{t('status.yangi')}</MenuItem>
                    <MenuItem value="qiziqishi_bor">{t('status.qiziqishi_bor')}</MenuItem>
                    <MenuItem value="juda_qiziqdi">{t('status.juda_qiziqdi')}</MenuItem>
                    <MenuItem value="rad_etildi">{t('status.rad_etildi')}</MenuItem>
                    <MenuItem value="mijozga_aylandi">{t('status.mijozga_aylandi')}</MenuItem>
                </Field.Select>
                <Field.Text
                    name="notes"
                    label={t('form.notes')}
                    placeholder={t('form.notes')}
                    multiline
                    rows={4}
                    sx={{ gridColumn: '1 / -1' }}
                />
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button variant="outlined" color="inherit" onClick={() => onSuccess?.()}>
                    {t('cancel')}
                </Button>
                <LoadingButton type="submit" variant="contained" loading={isPending}>
                    {isEdit ? t('update') : t('create')}
                </LoadingButton>
            </Stack>
        </Form>
    );
}
