import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';
import { MaterialsListView } from 'src/sections/klientlar/view/materials-view';

// ----------------------------------------------------------------------

export default function Page() {
    const { t } = useTranslate('navbar');

    return (
        <>
            <Helmet>
                <title> {t('materials')} | Polimaks</title>
            </Helmet>

            <MaterialsListView />
        </>
    );
}
