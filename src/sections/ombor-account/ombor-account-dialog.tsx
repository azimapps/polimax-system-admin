import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useGetOmborAccount, useCreateOmborAccount, useUpdateOmborAccount } from 'src/hooks/use-ombor-account';

import { useTranslate } from 'src/locales';

import { Form, Field } from 'src/components/hook-form';

import { OmborAccountRole } from 'src/types/ombor-account';

import { getOmborAccountFormSchema } from './ombor-account-schema';

import type { OmborAccountFormValues } from './ombor-account-schema';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    id?: number;
};

export function OmborAccountDialog({ open, onClose, id }: Props) {
    const { t } = useTranslate('ombor');
    const isUpdate = !!id;

    const { data: currentData, isLoading } = useGetOmborAccount(id);
    const { mutateAsync: createAccount, isPending: isCreating } = useCreateOmborAccount();
    const { mutateAsync: updateAccount, isPending: isUpdating } = useUpdateOmborAccount();
    const isSubmitting = isCreating || isUpdating;

    const schema = getOmborAccountFormSchema((key: string) => t(`form.${key}`), isUpdate);

    const methods = useForm<OmborAccountFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            login: '',
            password: '',
            role: OmborAccountRole.PLYONKA,
        },
    });

    const { reset, handleSubmit } = methods;

    useEffect(() => {
        if (open) {
            if (isUpdate && currentData) {
                reset({
                    login: currentData.login,
                    password: '',
                    role: currentData.role,
                });
            } else {
                reset({
                    login: '',
                    password: '',
                    role: OmborAccountRole.PLYONKA,
                });
            }
        }
    }, [open, isUpdate, currentData, reset]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (isUpdate) {
                const updateData: any = {};
                if (data.login !== currentData?.login) updateData.login = data.login;
                if (data.password) updateData.password = data.password;

                // At least one field needed
                if (Object.keys(updateData).length > 0) {
                    await updateAccount({ id, data: updateData });
                }
            } else {
                await createAccount({
                    login: data.login,
                    password: data.password!,
                    role: data.role,
                });
            }
            onClose();
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>{isUpdate ? t('edit_account') : t('new_account')}</DialogTitle>

                <DialogContent>
                    <Box gap={3} display="flex" flexDirection="column" sx={{ mt: 2 }}>
                        <Field.Text name="login" label={t('form.login')} />

                        <Field.Text
                            name="password"
                            label={t('form.password')}
                            type="password"
                            helperText={isUpdate ? t('form.password_update_hint') : ''}
                        />

                        {!isUpdate && (
                            <Field.Select name="role" label={t('form.role')}>
                                {Object.values(OmborAccountRole).map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {t(`role_options.${option}`)}
                                    </MenuItem>
                                ))}
                            </Field.Select>
                        )}
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        {t('cancel')}
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                        disabled={isLoading}
                    >
                        {isUpdate ? t('update') : t('create')}
                    </Button>
                </DialogActions>
            </Form>
        </Dialog>
    );
}
