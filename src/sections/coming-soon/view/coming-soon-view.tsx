
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

type Props = {
    title: string;
};

export function ComingSoonView({ title }: Props) {
    const { t } = useTranslate('navbar');

    return (
        <Container maxWidth="xl">
            <CustomBreadcrumbs
                heading={title}
                links={[
                    { name: 'Dashboard', href: '/' },
                    { name: title },
                ]}
                sx={{ mb: 3 }}
            />

            <Typography variant="h4">{title}</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>{t('coming_soon')}</Typography>
        </Container>
    );
}
