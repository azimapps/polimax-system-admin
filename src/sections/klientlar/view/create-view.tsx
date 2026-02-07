import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { KlientlarForm } from '../client-form';

// ----------------------------------------------------------------------

export function KlientlarCreateView() {
  const { t } = useTranslate('client');
  const navigate = useNavigate();

  const handleSuccess = useCallback(() => {
    navigate(paths.dashboard.klientlar.list);
  }, [navigate]);

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading={t('create_title')}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: t('list_title'), href: paths.dashboard.klientlar.list },
          { name: t('new_client') },
        ]}
        sx={{ mb: 3 }}
      />

      <KlientlarForm onSuccess={handleSuccess} />
    </Container>
  );
}
