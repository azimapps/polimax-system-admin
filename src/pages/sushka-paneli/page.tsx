
import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';
import { ComingSoonView } from 'src/sections/coming-soon/view/coming-soon-view';

export default function SushkaPaneliPage() {
    const { t } = useTranslate('navbar');
    return (
        <>
            <Helmet>
                <title> Dashboard: {t('sushka_paneli')}</title>
            </Helmet>
            <ComingSoonView title={t('sushka_paneli')} />
        </>
    );
}
