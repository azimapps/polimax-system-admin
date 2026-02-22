import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';
import { OrderPlanningView } from 'src/sections/order-planning/view/order-planning-view';

export default function OrderPlanningPage() {
    const { t } = useTranslate('navbar');
    return (
        <>
            <Helmet>
                <title> Dashboard: {t('order_planning')}</title>
            </Helmet>
            <OrderPlanningView />
        </>
    );
}
