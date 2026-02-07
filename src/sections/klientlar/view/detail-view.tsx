import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { useGetClient } from 'src/hooks/use-clients';

import { useTranslate } from 'src/locales';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { KlientlarForm } from '../client-form';

// ----------------------------------------------------------------------

type Props = {
    id: number;
};

export function KlientlarDetailView({ id }: Props) {
    const { t } = useTranslate('client');
    const navigate = useNavigate();
    const { data: client, isLoading } = useGetClient(id);

    const handleSuccess = useCallback(() => {
        navigate(paths.dashboard.klientlar.list);
    }, [navigate]);

    if (isLoading) {
        return <CircularProgress />;
    }

    if (!client) {
        return <div>Client not found</div>;
    }

    return (
        <Container maxWidth="lg">
            <CustomBreadcrumbs
                heading={client ? client.fullname : t('detail_title')}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: t('list_title'), href: paths.dashboard.klientlar.list },
                    { name: client.fullname },
                ]}
                sx={{ mb: 3 }}
            />

            <KlientlarForm client={client} onSuccess={handleSuccess} />
        </Container>
    );
}
