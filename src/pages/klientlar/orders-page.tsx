
import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';
import { OrdersView } from 'src/sections/klientlar/view/orders-view';

// ----------------------------------------------------------------------

export default function OrdersPage() {
    const { t } = useTranslate('order');

    return (
        <>
            <Helmet>
                <title> Dashboard: {t('list_title')}</title>
            </Helmet>

            <OrdersView />
        </>
    );
}
