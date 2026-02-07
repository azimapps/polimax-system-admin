import type { ButtonProps } from '@mui/material/Button';

import { useCallback } from 'react';

import Button from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type Props = ButtonProps & {
  onClose?: () => void;
};

export function SignOutButton({ onClose, sx, ...other }: Props) {
  const router = useRouter();
  const { logout } = useAuthContext();
  const { t } = useTranslate(['settings', 'auth']);

  const handleLogout = useCallback(async () => {
    try {
      await logout();

      onClose?.();
      router.refresh();
      toast.success(t('auth.logout_success'));
    } catch (error) {
      console.error(error);
      toast.error(t('auth.logout_failed'));
    }
  }, [onClose, router, logout, t]);

  return (
    <Button
      fullWidth
      variant="soft"
      size="large"
      color="error"
      onClick={handleLogout}
      sx={sx}
      {...other}
    >
      {t('logout')}
    </Button>
  );
}
