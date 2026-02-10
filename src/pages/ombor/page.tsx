
import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';
import { OmborListView } from 'src/sections/ombor/view/ombor-list-view';

export default function OmborPage() {
    const { t } = useTranslate('navbar');
    return (
        <>
            <Helmet>
                <title> Dashboard: {t('ombor')}</title>
            </Helmet>
            <OmborListView />
        </>
    );
}
