import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslate } from 'src/locales';
import { accountApi } from 'src/api/account';
import { uploadApi } from 'src/api/upload-api';

import { toast } from 'src/components/snackbar';
import { Form, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  //
};

export function AccountGeneral({ ...other }: Props) {
  const { t } = useTranslate();
  const { user, updateUser } = useAuthContext();

  const UpdateUserSchema = zod.object({
    fullname: zod.string().min(1, t('required')),
    avatar_url: zod.custom<File | string>().refine((data) => !!data, { message: t('required') }),
  });

  type UpdateUserSchemaType = zod.infer<typeof UpdateUserSchema>;

  const defaultValues = {
    fullname: user?.fullname || user?.username || '',
    avatar_url: user?.avatar_url || user?.photoURL || null,
  };

  const methods = useForm<UpdateUserSchemaType>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarUrl = data.avatar_url;

      if (data.avatar_url instanceof File) {
        const uploadRes = await uploadApi.uploadFile(data.avatar_url);
        avatarUrl = uploadRes.url;
      }

      const updatedUser = await accountApi.updateProfile({
        fullname: data.fullname,
        avatar_url: avatarUrl as string,
      });

      updateUser(updatedUser);
      toast.success(t('update_success'));
    } catch (error) {
      console.error(error);
      toast.error(t('update_failed'));
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ pt: 10, pb: 5, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="avatar_url"
              maxSize={3145728}
              onDrop={(acceptedFiles) => {
                const file = acceptedFiles[0];
                const newFile = Object.assign(file, {
                  preview: URL.createObjectURL(file),
                });
                setValue('avatar_url', newFile, { shouldValidate: true });
              }}
              helperText={
                <Box component="span" sx={{ mb: 2, display: 'block', color: 'text.secondary' }}>
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {3145728 / 1024 / 1024}MB
                </Box>
              }
            />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="fullname" label={t('fullname')} />
              {user?.email && (
                <RHFTextField name="email" label={t('email')} disabled value={user?.email || ''} />
              )}
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {t('save_changes')}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
