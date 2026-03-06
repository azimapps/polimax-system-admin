import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useTranslate } from 'src/locales';

import { useAuthContext } from 'src/auth/hooks';

import { setSession } from './utils';

// ----------------------------------------------------------------------

function getWorkerPanelRedirect(): string | null {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const isWorker =
    user?.type === 'worker' ||
    user?.role === 'worker' ||
    user?.worker_type ||
    ['pechat', 'reska', 'laminatsiya', 'sushka'].includes(user?.role);

  if (!isWorker) return null;

  // Laminatsiya workers → laminatsiya panel
  if (user?.worker_type === 'laminatsiya' || user?.role === 'laminatsiya') {
    return paths.dashboard.laminatsiyaPanel.root;
  }

  // Everyone else (pechat, reska, sushka, generic worker) → pechat panel
  return paths.dashboard.pechatPanel.root;
}

export type SignInParams = {
  login: string;
  password: string;
  captchaToken: string;
};

/** **************************************
 * Sign in
 *************************************** */

export const useSignIn = () => {
  const router = useRouter();
  const { login } = useAuthContext();
  const searchParams = useSearchParams();
  const { t } = useTranslate();

  const returnTo = searchParams.get('returnTo') || CONFIG.auth.redirectPath;

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (value: SignInParams) => {
      await login(value);
    },
    onSuccess: () => {
      toast.success('Hush kelibsiz', { position: 'top-center' });
      router.replace(getWorkerPanelRedirect() || returnTo);
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.detail
        ? err.response.data.detail.includes('Invalid')
          ? t('auth.invalid_credentials')
          : t('auth.login_failed')
        : t('auth.login_failed');
      toast.error(errorMessage, { position: 'top-center' });
    },
  });

  return { isPending, mutateAsync };
};

export const useStaffLogin = () => {
  const router = useRouter();
  const { staffLogin } = useAuthContext();
  const searchParams = useSearchParams();
  const { t } = useTranslate();

  // Removed unused returnTo defined here as it is done dynamicly
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (value: Record<string, any>) => {
      await staffLogin(value);
    },
    onSuccess: () => {
      toast.success('Hush kelibsiz', { position: 'top-center' });
      router.replace(getWorkerPanelRedirect() || searchParams.get('returnTo') || CONFIG.auth.redirectPath);
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.detail
        ? err.response.data.detail.includes('Invalid') || err.response.data.detail.includes('not linked')
          ? err.response.data.detail
          : t('auth.login_failed')
        : t('auth.login_failed');
      toast.error(errorMessage, { position: 'top-center' });
    },
  });

  return { isPending, mutateAsync };
};

export const usePhoneLogin = () => {
  const router = useRouter();
  const { phoneLogin } = useAuthContext();
  const searchParams = useSearchParams();
  const { t } = useTranslate();

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (value: { phone: string }) => {
      await phoneLogin(value);
    },
    onSuccess: () => {
      toast.success('Hush kelibsiz', { position: 'top-center' });
      router.replace(getWorkerPanelRedirect() || searchParams.get('returnTo') || CONFIG.auth.redirectPath);
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.detail || t('auth.login_failed');
      toast.error(errorMessage, { position: 'top-center' });
    },
  });

  return { isPending, mutateAsync };
};

export const useOmborLogin = () => {
  const router = useRouter();
  const { omborLogin } = useAuthContext();
  const searchParams = useSearchParams();
  const { t } = useTranslate();

  const returnTo = searchParams.get('returnTo') || CONFIG.auth.redirectPath;

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (value: Record<string, any>) => {
      await omborLogin(value);
    },
    onSuccess: () => {
      toast.success('Hush kelibsiz', { position: 'top-center' });
      router.replace(returnTo);
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.detail
        ? err.response.data.detail.includes('Invalid')
          ? t('auth.invalid_credentials')
          : t('auth.login_failed')
        : t('auth.login_failed');
      toast.error(errorMessage, { position: 'top-center' });
    },
  });

  return { isPending, mutateAsync };
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
    console.log('Successfully signed out and cleared cookies.');
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
