
import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';
import { ComingSoonView } from 'src/sections/coming-soon/view/coming-soon-view';

export default function FinancePage() {
    const { t } = useTranslate('navbar');
    return (
        <>
            <Helmet>
                <title> Dashboard: {t('finance')}</title>
            </Helmet>
            <ComingSoonView title={t('finance')} />
        </>
    );
}
