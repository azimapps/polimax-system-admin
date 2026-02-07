import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';
import { KlientlarCreateView } from 'src/sections/klientlar/view/create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Create Client | ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{metadata.title}</title>
            </Helmet>

            <KlientlarCreateView />
        </>
    );
}
