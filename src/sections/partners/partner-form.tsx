import type { Partner, CreatePartnerRequest, UpdatePartnerRequest } from 'src/types/partner';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { useCreatePartner, useUpdatePartner } from 'src/hooks/use-partners';

import { useTranslate } from 'src/locales';
import { uploadApi } from 'src/api/upload-api';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { getPartnerFormSchema } from './partner-schema';

// ----------------------------------------------------------------------

type Props = {
    partner?: Partner;
    onSuccess?: () => void;
};

export function PartnerForm({ partner, onSuccess }: Props) {
    const { t } = useTranslate('partner');
    const isEdit = !!partner;

    const { mutateAsync: createPartner, isPending: isCreating } = useCreatePartner();
    const { mutateAsync: updatePartner, isPending: isUpdating } = useUpdatePartner(partner?.id || 0);

    const isPending = isCreating || isUpdating;
    const [isUploading, setIsUploading] = useState(false);

    const methods = useForm<CreatePartnerRequest>({
        resolver: zodResolver(getPartnerFormSchema(t)),
        defaultValues: {
            fullname: partner?.fullname || '',
            phone_number: partner?.phone_number || '',
            company: partner?.company || '',
            notes: partner?.notes || '',
            categories: partner?.categories || [],
            logo_url: partner?.logo_url || '',
            image_urls: partner?.image_urls || [],
        },
    });

    const { handleSubmit, setValue, watch } = methods;

    const logoUrl = watch('logo_url');
    const watchedImageUrls = watch('image_urls');
    const imageUrls = useMemo(() => watchedImageUrls || [], [watchedImageUrls]);

    const handleLogoUpload = useCallback(
        async (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return;
            const file = acceptedFiles[0];
            setIsUploading(true);
            try {
                const { url } = await uploadApi.uploadFile(file);
                setValue('logo_url', url, { shouldValidate: true });
                toast.success(t('image_uploaded_success'));
            } catch (error) {
                console.error(error);
                toast.error(t('image_upload_failed'));
            } finally {
                setIsUploading(false);
            }
        },
        [setValue, t]
    );

    const handleImagesUpload = useCallback(
        async (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return;
            setIsUploading(true);
            try {
                const { urls } = await uploadApi.uploadFiles(acceptedFiles);
                setValue('image_urls', [...imageUrls, ...urls], { shouldValidate: true });
                toast.success(t('image_uploaded_success'));
            } catch (error) {
                console.error(error);
                toast.error(t('image_upload_failed'));
            } finally {
                setIsUploading(false);
            }
        },
        [imageUrls, setValue, t]
    );

    const handleRemoveImage = useCallback(
        (url: string) => {
            const filtered = imageUrls.filter((item: string) => item !== url);
            setValue('image_urls', filtered, { shouldValidate: true });
        },
        [imageUrls, setValue]
    );

    const onSubmit = handleSubmit(async (data: CreatePartnerRequest) => {
        try {
            if (isEdit) {
                await updatePartner(data as UpdatePartnerRequest);
                toast.success(t('messages.success_update'));
            } else {
                await createPartner(data);
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
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <Box sx={{ flexShrink: 0 }}>
                        <Field.UploadAvatar
                            name="logo_url"
                            value={logoUrl || undefined}
                            onDrop={handleLogoUpload}
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

                    <Box flexGrow={1}>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                            }}
                        >
                            <Field.Text
                                name="fullname"
                                label={t('form.fullname')}
                                placeholder={t('form.fullname')}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                            <Field.Phone
                                name="phone_number"
                                label={t('form.phone_number')}
                                country="UZ"
                                placeholder="99 XXX XX XX"
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                            <Field.Text
                                name="company"
                                label={t('form.company')}
                                placeholder={t('form.company')}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                            <Field.Autocomplete
                                name="categories"
                                label={t('form.categories')}
                                multiple
                                placeholder={t('form.select_categories')}
                                options={['Plyonka', 'Kraska', 'Rastvaritel', 'Silindir', 'Kley']}
                                getOptionLabel={(option) => option}
                                slotProps={{
                                    textfield: {
                                        InputLabelProps: { shrink: true }
                                    }
                                }}
                            />
                        </Box>
                    </Box>
                </Stack>

                <Field.Text
                    name="notes"
                    label={t('form.notes')}
                    placeholder={t('form.notes')}
                    InputLabelProps={{ shrink: true }}
                    multiline
                    rows={4}
                />

                <Box>
                    <Field.Upload
                        multiple
                        name="image_urls"
                        value={imageUrls}
                        onDrop={handleImagesUpload}
                        onRemove={(url) => typeof url === 'string' && handleRemoveImage(url)}
                        onRemoveAll={() => setValue('image_urls', [], { shouldValidate: true })}
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
