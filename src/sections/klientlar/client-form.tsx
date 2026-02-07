import type { Client, CreateClientRequest, UpdateClientRequest } from 'src/types/client';

import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { useCreateClient, useUpdateClient } from 'src/hooks/use-clients';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
    client?: Client;
    onSuccess?: () => void;
};

export function KlientlarForm({ client, onSuccess }: Props) {
    const { t } = useTranslate('client');
    const isEdit = !!client;

    const { mutateAsync: createClient, isPending: isCreating } = useCreateClient();
    const { mutateAsync: updateClient, isPending: isUpdating } = useUpdateClient(client?.id || 0);

    const isPending = isCreating || isUpdating;

    const methods = useForm<CreateClientRequest>({
        defaultValues: {
            fullname: client?.fullname || '',
            phone_number: client?.phone_number || '',
            company: client?.company || '',
            notes: client?.notes || '',
            profile_url: client?.profile_url || '',
            image_urls: client?.image_urls || [],
        },
    });

    const { handleSubmit } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (isEdit) {
                await updateClient(data as UpdateClientRequest);
                toast.success(t('messages.success_update'));
            } else {
                await createClient(data);
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
            <Stack spacing={3}>
                <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                    }}
                >
                    <Field.Text name="fullname" label={t('form.fullname')} required />
                    <Field.Text name="phone_number" label={t('form.phone_number')} required />
                    <Field.Text name="company" label={t('form.company')} />
                    <Field.Text name="profile_url" label={t('form.profile_url')} />
                    <Field.Text
                        name="notes"
                        label={t('form.notes')}
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
            </Stack>
        </Form>
    );
}
