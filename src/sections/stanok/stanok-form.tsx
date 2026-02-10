
import type { Stanok, CreateStanokRequest, UpdateStanokRequest } from 'src/types/stanok';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useCreateStanok, useUpdateStanok } from 'src/hooks/use-stanok';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { FlagIcon } from 'src/components/flag-icon';
import { Form, Field } from 'src/components/hook-form';

import { StanokType } from 'src/types/stanok';

import { getStanokFormSchema } from './stanok-schema';

// ----------------------------------------------------------------------

type Props = {
    stanok?: Stanok;
    onSuccess?: () => void;
    onCancel?: () => void;
    defaultType?: StanokType;
};

const COUNTRIES = ['CN', 'DE', 'UZ', 'RU', 'GB', 'IN'];

export function StanokForm({ stanok, onSuccess, onCancel, defaultType }: Props) {
    const { t } = useTranslate('stanok');
    const isEdit = !!stanok;

    const { mutateAsync: createStanok, isPending: isCreating } = useCreateStanok();
    const { mutateAsync: updateStanok, isPending: isUpdating } = useUpdateStanok(stanok?.id || 0);

    const isPending = isCreating || isUpdating;

    const methods = useForm<CreateStanokRequest>({
        resolver: zodResolver(getStanokFormSchema(t)),
        defaultValues: {
            name: stanok?.name || '',
            country_code: stanok?.country_code || '',
            type: stanok?.type || defaultType || StanokType.PECHAT,
        },
    });

    const { handleSubmit, reset, setValue } = methods;

    useEffect(() => {
        if (defaultType && !stanok) {
            setValue('type', defaultType);
        }
    }, [defaultType, stanok, setValue]);

    useEffect(() => {
        if (stanok) {
            reset({
                name: stanok.name,
                country_code: stanok.country_code,
                type: stanok.type,
            });
        }
    }, [stanok, reset]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (isEdit) {
                await updateStanok(data as UpdateStanokRequest);
                toast.success(t('messages.success_update'));
            } else {
                await createStanok(data);
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
                    gridTemplateColumns='repeat(1, 1fr)'
                    sx={{ mt: 2 }}
                >
                    <Field.Text name="name" label={t('form.name')} required />

                    <Field.Select
                        name="country_code"
                        label={t('form.country_code')}
                        required
                        slotProps={{
                            select: {
                                renderValue: (selected) => {
                                    const code = selected as string;
                                    if (!code) return null;
                                    return (
                                        <Box gap={1} display="flex" alignItems="center">
                                            <FlagIcon code={code} />
                                            <Typography component="span" variant="body2">
                                                {t(`country.${code.toLowerCase()}`)}
                                            </Typography>
                                        </Box>
                                    );
                                }
                            }
                        }}
                    >
                        {COUNTRIES.map((code) => (
                            <MenuItem key={code} value={code}>
                                <Box gap={1} display="flex" alignItems="center">
                                    <FlagIcon code={code} />
                                    <Typography component="span" variant="body2">
                                        {t(`country.${code.toLowerCase()}`)}
                                    </Typography>
                                </Box>
                            </MenuItem>
                        ))}
                    </Field.Select>

                    {!defaultType && (
                        <Field.Select name="type" label={t('form.type')} required>
                            {Object.values(StanokType).map((option) => (
                                <MenuItem key={option} value={option}>
                                    {t(`type.${option}`)}
                                </MenuItem>
                            ))}
                        </Field.Select>
                    )}
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                    <Button variant="outlined" color="inherit" onClick={onCancel}>
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
