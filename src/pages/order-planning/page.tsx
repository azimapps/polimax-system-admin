
import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';
import { ComingSoonView } from 'src/sections/coming-soon/view/coming-soon-view';

export default function OrderPlanningPage() {
    const { t } = useTranslate('navbar');
    return (
        <>
            <Helmet>
                <title> Dashboard: {t('order_planning')}</title>
            </Helmet>
            <ComingSoonView title={t('order_planning')} />
        </>
    );
}
