import type { Client, CreateClientRequest, UpdateClientRequest } from 'src/types/client';

import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { useCreateClient, useUpdateClient } from 'src/hooks/use-clients';

import { useTranslate } from 'src/locales';
import { uploadApi } from 'src/api/upload-api';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { getClientFormSchema } from './client-schema';

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
    const [isUploading, setIsUploading] = useState(false);

    const methods = useForm<CreateClientRequest>({
        resolver: zodResolver(getClientFormSchema(t)),
        defaultValues: {
            fullname: client?.fullname || '',
            phone_number: client?.phone_number || '',
            company: client?.company || '',
            notes: client?.notes || '',
            profile_url: client?.profile_url || '',
            image_urls: client?.image_urls || [],
        },
    });

    const { handleSubmit, setValue, watch } = methods;

    const profileUrl = watch('profile_url');

    const handleFileUpload = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        setIsUploading(true);

        try {
            const { url } = await uploadApi.uploadFile(file);
            setValue('profile_url', url, { shouldValidate: true });
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    }, [setValue]);

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
                <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
                    <Field.UploadAvatar
                        name="profile_image"
                        value={profileUrl || undefined}
                        onDrop={handleFileUpload}
                        disabled={isUploading}
                        placeholder={profileUrl ? t('update_photo') : t('upload_photo')}
                        helperText={
                            <Box component="span" sx={{ typography: 'caption', color: 'text.disabled', mt: 2, display: 'block', textAlign: 'center' }}>
                                {t('upload_photo')}
                            </Box>
                        }
                    />
                </Box>

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
                        required
                    />
                    <Field.Text name="company" label={t('form.company')} />
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
                    <LoadingButton type="submit" variant="contained" loading={isPending || isUploading}>
                        {isEdit ? t('update') : t('create')}
                    </LoadingButton>
                </Stack>
            </Stack>
        </Form>
    );
}
