import type { ButtonProps } from '@mui/material/Button';

import { useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Button from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type Props = ButtonProps & {
  onClose?: () => void;
};

export function SignOutButton({ onClose, sx, ...other }: Props) {
  const router = useRouter();
  const { logout } = useAuthContext();
  const { t } = useTranslate(['auth', 'settings']);

  const confirm = useBoolean();

  const handleLogout = useCallback(async () => {
    try {
      await logout();

      onClose?.();
      confirm.onFalse();
      router.refresh();
      toast.success(t('logout_success'));
    } catch (error) {
      console.error(error);
      toast.error(t('logout_failed'));
    }
  }, [onClose, router, logout, t, confirm]);

  return (
    <>
      <Button
        fullWidth
        variant="soft"
        size="large"
        color="error"
        onClick={confirm.onTrue}
        sx={sx}
        {...other}
      >
        {t('logout')}
      </Button>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('logout_confirm_title')}
        content={t('logout_confirm_content')}
        action={
          <Button variant="contained" color="error" onClick={handleLogout}>
            {t('logout_confirm_button')}
          </Button>
        }
      />
    </>
  );
}
