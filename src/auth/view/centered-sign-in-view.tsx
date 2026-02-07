import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { AnimateLogoRotate } from 'src/components/animate';

import { useSignIn } from '../context/jwt';
import { FormHead } from '../components/form-head';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  login: zod.string().min(1, { message: 'Login is required!' }),
  password: zod.string().min(1, { message: 'Password is required!' }),
});

// ----------------------------------------------------------------------

export function CenteredSignInView() {
  const showPassword = useBoolean();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { isPending, mutateAsync } = useSignIn();
  const defaultValues: SignInSchemaType = {
    login: '',
    password: '',
  };

  const { t } = useTranslate('auth');

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      let token = '';
      if (executeRecaptcha) {
        token = await executeRecaptcha('form_submit');
      }
      return await mutateAsync({
        ...data,
        captchaToken: token,
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text
        name="login"
        label={t('login_label')}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>
        <Field.Text
          name="password"
          label={t('password_label')}
          placeholder={t('password_placeholder')}
          type={showPassword.value ? 'text' : 'password'}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isPending}
        loadingIndicator={t('loading_indicator')}
      >
        {t('sign_in_button')}
      </Button>
    </Box>
  );

  return (
    <>
      <AnimateLogoRotate sx={{ mb: 3, mx: 'auto' }} />

      <FormHead title={t('sign_in_title')} description={null} />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>
    </>
  );
}
