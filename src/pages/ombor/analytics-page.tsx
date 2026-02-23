import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';
import { OmborAnalyticsView } from 'src/sections/ombor/view/ombor-analytics-view';

// ----------------------------------------------------------------------

export default function OmborAnalyticsPage() {
    const { t } = useTranslate('ombor');

    return (
        <>
            <Helmet>
                <title> Dashboard: {t('ombor_analytics')} </title>
            </Helmet>

            <OmborAnalyticsView />
        </>
    );
}
