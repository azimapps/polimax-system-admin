import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { DashboardView } from 'src/sections/dashboard/view';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function Page() {
  const router = useRouter();
  const { user } = useAuthContext();

  useEffect(() => {
    const isWorker =
      user?.type === 'worker' ||
      user?.role === 'worker' ||
      user?.worker_type ||
      ['pechat', 'reska', 'laminatsiya', 'sushka'].includes(user?.role);

    if (isWorker) {
      if (user?.worker_type === 'laminatsiya' || user?.role === 'laminatsiya') {
        router.replace(paths.dashboard.laminatsiyaPanel.root);
      } else {
        router.replace(paths.dashboard.pechatPanel.root);
      }
    }
  }, [user, router]);

  return (
    <>
      <Helmet>
        <title> {CONFIG.appName} - Dashboard </title>
      </Helmet>

      <DashboardView />
    </>
  );
}
