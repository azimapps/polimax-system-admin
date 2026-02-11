import type { Material, CreateMaterialRequest, UpdateMaterialRequest } from 'src/types/material';

import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { useCreateMaterial, useUpdateMaterial } from 'src/hooks/use-materials';

import { useTranslate } from 'src/locales';
import { uploadApi } from 'src/api/upload-api';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { getMaterialFormSchema } from './material-schema';

// ----------------------------------------------------------------------

type Props = {
    material?: Material;
    onSuccess?: () => void;
};

export function MaterialForm({ material, onSuccess }: Props) {
    const { t } = useTranslate('material');
    const isEdit = !!material;

    const { mutateAsync: createMaterial, isPending: isCreating } = useCreateMaterial();
    const { mutateAsync: updateMaterial, isPending: isUpdating } = useUpdateMaterial(material?.id || 0);

    const isPending = isCreating || isUpdating;
    const [isUploading, setIsUploading] = useState(false);

    const methods = useForm<CreateMaterialRequest>({
        resolver: zodResolver(getMaterialFormSchema(t)),
        defaultValues: {
            fullname: material?.fullname || '',
            phone_number: material?.phone_number || '',
            company: material?.company || '',
            notes: material?.notes || '',
            logo_url: material?.logo_url || '',
            image_urls: material?.image_urls || [],
        },
    });

    const { handleSubmit, setValue, watch } = methods;

    const logoUrl = watch('logo_url');

    const handleFileUpload = useCallback(
        async (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return;

            const file = acceptedFiles[0];
            setIsUploading(true);

            try {
                const { url } = await uploadApi.uploadFile(file);
                setValue('logo_url', url, { shouldValidate: true });
                toast.success(t('image_uploaded_success') || 'Image uploaded');
            } catch (error) {
                console.error(error);
                toast.error(t('image_upload_failed') || 'Upload failed');
            } finally {
                setIsUploading(false);
            }
        },
        [setValue, t]
    );

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (isEdit) {
                await updateMaterial(data as UpdateMaterialRequest);
                toast.success(t('messages.success_update'));
            } else {
                await createMaterial(data);
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
                        name="logo_image"
                        value={logoUrl || undefined}
                        onDrop={handleFileUpload}
                        disabled={isUploading}
                        placeholder={logoUrl ? t('update_photo') : t('upload_photo')}
                        helperText={
                            <Box
                                component="span"
                                sx={{
                                    typography: 'caption',
                                    color: 'text.disabled',
                                    mt: 2,
                                    display: 'block',
                                    textAlign: 'center',
                                }}
                            >
                                {t('allowed_formats_hint')}
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
                        InputLabelProps={{ shrink: true }}
                        disableSelect
                        required
                    />
                    <Field.Text
                        name="company"
                        label={t('form.company')}
                        placeholder={t('form.company')}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <Field.Text
                        name="notes"
                        label={t('form.notes')}
                        placeholder={t('form.notes')}
                        InputLabelProps={{ shrink: true }}
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
