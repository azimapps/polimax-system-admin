import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales';
import { accountApi } from 'src/api/account';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function AccountChangePassword() {
  const { t } = useTranslate();

  const password = useBoolean();
  const newPassword = useBoolean();
  const confirmPassword = useBoolean();

  const ChangePassWordSchema = zod
    .object({
      oldPassword: zod.string().min(1, t('required')),
      newPassword: zod.string().min(6, t('password_min_length')),
      confirmNewPassword: zod.string().min(1, t('required')),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t('passwords_not_match'),
      path: ['confirmNewPassword'],
    });

  type ChangePassWordSchemaType = zod.infer<typeof ChangePassWordSchema>;

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm<ChangePassWordSchemaType>({
    resolver: zodResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await accountApi.updatePassword({
        old_password: data.oldPassword,
        new_password: data.newPassword,
      });
      reset();
      toast.success(t('update_success'));
    } catch (error) {
      console.error(error);
      toast.error(
        typeof error === 'string' ? error : (error as any)?.message || t('update_failed')
      );
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
        <RHFTextField
          name="oldPassword"
          type={password.value ? 'text' : 'password'}
          label={t('old_password')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="newPassword"
          type={newPassword.value ? 'text' : 'password'}
          label={t('new_password')}
          helperText={
            <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify icon="solar:info-circle-bold" width={16} sx={{ mr: 0.5 }} />{' '}
              {t('password_requirements')}
            </Box>
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={newPassword.onToggle} edge="end">
                  <Iconify icon={newPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="confirmNewPassword"
          type={confirmPassword.value ? 'text' : 'password'}
          label={t('confirm_new_password')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={confirmPassword.onToggle} edge="end">
                  <Iconify
                    icon={confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          {t('save_changes')}
        </LoadingButton>
      </Card>
    </Form>
  );
}
