import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';

import { AccountButton } from './account-button';

// ----------------------------------------------------------------------

export function AccountDrawer() {
  const router = useRouter();
  const { user } = useAuthContext();

  const handleOpen = () => {
    router.push(paths.dashboard.user.profile);
  };

  return (
    <AccountButton
      onClick={handleOpen}
      photoURL={user?.avatar_url || user?.photoURL}
      displayName={user?.fullname || user?.login || user?.username}
    />
  );
}
