import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';
import { CRMView } from 'src/sections/klientlar/view/crm-view';

// ----------------------------------------------------------------------

export default function CRMPage() {
    return (
        <>
            <Helmet>
                <title> {`CRM - ${CONFIG.appName}`}</title>
            </Helmet>

            <CRMView />
        </>
    );
}
