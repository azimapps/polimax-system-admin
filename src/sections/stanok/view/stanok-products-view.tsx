
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

export function StanokProductsView() {
    const { t } = useTranslate('stanok');
    const params = useParams();
    const { id } = params;

    return (
        <Container maxWidth="xl">
            <CustomBreadcrumbs
                heading={t('actions_menu.products')}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: t('list_title'), href: paths.dashboard.stanoklar.list },
                    { name: t('actions_menu.products') },
                ]}
                sx={{ mb: 3 }}
            />

            <Typography variant="h4">Products for Stanok ID: {id}</Typography>
            <Typography variant="body1">{t('coming_soon')}</Typography>
        </Container>
    );
}
