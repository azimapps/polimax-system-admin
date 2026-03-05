import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { AnimateLogoRotate } from 'src/components/animate';

import { FormHead } from '../components/form-head';
import { TelegramLoginButton } from '../components/telegram-login';
import { useSignIn, useStaffLogin, usePhoneLogin, useOmborLogin } from '../context/jwt';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  login: zod.string().min(1, { message: 'Login is required!' }),
  password: zod.string().min(1, { message: 'Password is required!' }),
});

// ----------------------------------------------------------------------

export function CenteredSignInView() {
  const [currentTab, setCurrentTab] = useState('manager');
  const showPassword = useBoolean();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { isPending, mutateAsync } = useSignIn();
  const { isPending: isStaffPending, mutateAsync: mutateStaffAsync } = useStaffLogin();
  const { isPending: isPhonePending, mutateAsync: mutatePhoneAsync } = usePhoneLogin();
  const { isPending: isOmborPending, mutateAsync: mutateOmborAsync } = useOmborLogin();
  const [phoneValue, setPhoneValue] = useState('');

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

  const onSubmitOmbor = handleSubmit(async (data) => {
    try {
      return await mutateOmborAsync({
        login: data.login,
        password: data.password,
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  const renderForm = (isOmbor: boolean = false) => (
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
        loading={isOmbor ? isOmborPending : isPending}
        loadingIndicator={t('loading_indicator')}
      >
        {t('sign_in_button')}
      </Button>
    </Box>
  );

  const renderTabs = () => (
    <Tabs
      value={currentTab}
      onChange={(_, newValue) => setCurrentTab(newValue)}
      sx={{ mb: 3 }}
      centered
    >
      <Tab value="manager" label="Manager / CEO Login" />
      <Tab value="staff" label="Staff Telegram Login" />
      <Tab value="phone" label="Phone Login" />
      <Tab value="ombor" label="Ombor Login" />
    </Tabs>
  );

  return (
    <>
      <AnimateLogoRotate sx={{ mb: 3, mx: 'auto' }} />

      <FormHead title={t('sign_in_title')} description={null} />

      {renderTabs()}

      {currentTab === 'manager' && (
        <Form methods={methods} onSubmit={onSubmit}>
          {renderForm()}
        </Form>
      )}

      {currentTab === 'staff' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TelegramLoginButton
            botName="Polimaxuz_bot"
            onAuth={async (user) => {
              await mutateStaffAsync({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name ?? null,
                username: user.username ?? null,
                photo_url: user.photo_url ?? null,
                auth_date: user.auth_date,
                hash: user.hash,
              });
            }}
          />
          {isStaffPending && (
            <Box sx={{ mt: 2, color: 'text.secondary' }}>Kirish amalga oshirilmoqda...</Box>
          )}
        </Box>
      )}

      {currentTab === 'phone' && (
        <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
          <TextField
            fullWidth
            label="Telefon raqami"
            placeholder="990330919"
            value={phoneValue}
            onChange={(e) => setPhoneValue(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Button
            fullWidth
            color="inherit"
            size="large"
            variant="contained"
            loading={isPhonePending}
            loadingIndicator={t('loading_indicator')}
            onClick={async () => {
              if (phoneValue.trim()) {
                await mutatePhoneAsync({ phone: phoneValue.trim() });
              }
            }}
          >
            {t('sign_in_button')}
          </Button>
        </Box>
      )}

      {currentTab === 'ombor' && (
        <Form methods={methods} onSubmit={onSubmitOmbor}>
          {renderForm(true)}
        </Form>
      )}
    </>
  );
}
