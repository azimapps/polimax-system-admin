
import type { Staff, CreateStaffRequest, UpdateStaffRequest } from 'src/types/staff';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useCreateStaff, useUpdateStaff } from 'src/hooks/use-staff';

import { useTranslate } from 'src/locales';
import { uploadApi } from 'src/api/upload-api';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { StaffType, WorkerType, AccountantType } from 'src/types/staff';

import { getStaffFormSchema } from './staff-schema';

// ----------------------------------------------------------------------

type Props = {
    staff?: Staff;
    onSuccess?: () => void;
    onCancel?: () => void;
    fixedType?: StaffType;
};

export function StaffForm({ staff, onSuccess, onCancel, fixedType }: Props) {
    const { t } = useTranslate('staff');
    const isEdit = !!staff;

    const { mutateAsync: createStaff, isPending: isCreating } = useCreateStaff();
    const { mutateAsync: updateStaff, isPending: isUpdating } = useUpdateStaff(staff?.id || 0);

    const isPending = isCreating || isUpdating;
    const [isUploading, setIsUploading] = useState(false);

    const methods = useForm<CreateStaffRequest>({
        resolver: zodResolver(getStaffFormSchema(t)),
        defaultValues: {
            fullname: staff?.fullname || '',
            phone_number: staff?.phone_number || '',
            notes: staff?.notes || '',
            avatar_url: staff?.avatar_url || '',
            type: staff?.type || fixedType || StaffType.CRM,
            accountant_type: staff?.accountant_type || null,
            worker_type: staff?.worker_type || null,
            fixed_salary: staff?.fixed_salary || 0,
            worker_fixed_salary: staff?.worker_fixed_salary || 0,
            starting_salary: staff?.starting_salary || 0,
            kpi_salary: staff?.kpi_salary || 0,
            kpi_tayyor_mahsulotlar_reskasi: staff?.kpi_tayyor_mahsulotlar_reskasi || 0,
            kpi_tayyor_mahsulot_peremotkasi: staff?.kpi_tayyor_mahsulot_peremotkasi || 0,
            kpi_plyonka_peremotkasi: staff?.kpi_plyonka_peremotkasi || 0,
            kpi_3_5_sm_reska: staff?.kpi_3_5_sm_reska || 0,
            kpi_asobiy_tarif: staff?.kpi_asobiy_tarif || 0,
        },
    });

    const { handleSubmit, setValue, watch, reset } = methods;

    const currentType = watch('type');
    const currentWorkerType = watch('worker_type');
    const avatarUrl = watch('avatar_url');

    useEffect(() => {
        if (staff) {
            reset({
                fullname: staff.fullname,
                phone_number: staff.phone_number,
                notes: staff.notes,
                avatar_url: staff.avatar_url,
                type: staff.type,
                accountant_type: staff.accountant_type,
                worker_type: staff.worker_type,
                fixed_salary: staff.fixed_salary,
                worker_fixed_salary: staff.worker_fixed_salary,
                starting_salary: staff.starting_salary,
                kpi_salary: staff.kpi_salary,
                kpi_tayyor_mahsulotlar_reskasi: staff.kpi_tayyor_mahsulotlar_reskasi,
                kpi_tayyor_mahsulot_peremotkasi: staff.kpi_tayyor_mahsulot_peremotkasi,
                kpi_plyonka_peremotkasi: staff.kpi_plyonka_peremotkasi,
                kpi_3_5_sm_reska: staff.kpi_3_5_sm_reska,
                kpi_asobiy_tarif: staff.kpi_asobiy_tarif,
            });
        }
    }, [staff, reset]);

    const handleFileUpload = useCallback(
        async (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return;

            const file = acceptedFiles[0];
            setIsUploading(true);

            try {
                const { url } = await uploadApi.uploadFile(file);
                setValue('avatar_url', url, { shouldValidate: true });
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

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (isEdit) {
                await updateStaff(data as UpdateStaffRequest);
                toast.success(t('messages.success_update'));
            } else {
                await createStaff(data);
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
                        name="avatar_url"
                        value={avatarUrl || undefined}
                        onDrop={handleFileUpload}
                        disabled={isUploading}
                        placeholder={avatarUrl ? t('update_photo') : t('upload_photo')}
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
                        placeholder={t('phone_placeholder')}
                        InputLabelProps={{ shrink: true }}
                        disableSelect
                    />

                    {!fixedType && (
                        <Field.Select
                            name="type"
                            label={t('form.type')}
                            InputLabelProps={{ shrink: true }}
                            required
                        >
                            {Object.values(StaffType).map((option) => (
                                <MenuItem key={option} value={option}>
                                    {t(`type.${option}`)}
                                </MenuItem>
                            ))}
                        </Field.Select>
                    )}

                    {currentType === StaffType.WORKER && (
                        <Field.Select
                            name="worker_type"
                            label={t('form.worker_type')}
                            InputLabelProps={{ shrink: true }}
                            required
                        >
                            {Object.values(WorkerType).map((option) => (
                                <MenuItem key={option} value={option}>
                                    {t(`role.${option}`)}
                                </MenuItem>
                            ))}
                        </Field.Select>
                    )}

                    {currentType === StaffType.ACCOUNTANT && (
                        <Field.Select
                            name="accountant_type"
                            label={t('form.accountant_type')}
                            InputLabelProps={{ shrink: true }}
                            required
                        >
                            {Object.values(AccountantType).map((option) => (
                                <MenuItem key={option} value={option}>
                                    {t(`role.${option}`)}
                                </MenuItem>
                            ))}
                        </Field.Select>
                    )}

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

                <Divider sx={{ borderStyle: 'dashed', my: 2 }} />

                <Typography variant="h6" sx={{ mb: 2 }}>
                    {t('form.salary_details')}
                </Typography>

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
                        name="fixed_salary"
                        label={currentWorkerType === WorkerType.RESKA ? t('form.fixed_salary') : t('form.fixed_salary_simple')}
                        InputLabelProps={{ shrink: true }}
                        type="number"
                    />

                    {currentWorkerType === WorkerType.RESKA && (
                        <Field.Text name="worker_fixed_salary" label={t('form.worker_fixed_salary')} InputLabelProps={{ shrink: true }} type="number" />
                    )}

                    <Field.Text name="starting_salary" label={t('form.starting_salary')} InputLabelProps={{ shrink: true }} type="number" />
                    <Field.Text
                        name="kpi_salary"
                        label={currentWorkerType === WorkerType.RESKA ? t('form.kpi_salary') : t('form.kpi_asosiy_kursatkich')}
                        InputLabelProps={{ shrink: true }}
                        type="number"
                    />

                    {currentType === StaffType.WORKER && currentWorkerType === WorkerType.RESKA && (
                        <>
                            <Field.Text name="kpi_tayyor_mahsulotlar_reskasi" label={t('form.kpi_tayyor_mahsulotlar_reskasi')} InputLabelProps={{ shrink: true }} type="number" />
                            <Field.Text name="kpi_tayyor_mahsulot_peremotkasi" label={t('form.kpi_tayyor_mahsulot_peremotkasi')} InputLabelProps={{ shrink: true }} type="number" />
                            <Field.Text name="kpi_plyonka_peremotkasi" label={t('form.kpi_plyonka_peremotkasi')} InputLabelProps={{ shrink: true }} type="number" />
                            <Field.Text name="kpi_3_5_sm_reska" label={t('form.kpi_3_5_sm_reska')} InputLabelProps={{ shrink: true }} type="number" />
                            <Field.Text name="kpi_asobiy_tarif" label={t('form.kpi_asobiy_tarif')} InputLabelProps={{ shrink: true }} type="number" />
                        </>
                    )}
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                    <Button variant="outlined" color="inherit" onClick={onCancel}>
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
