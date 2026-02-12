import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';
import { ArchivedView } from 'src/sections/finance/view/archived-view';

// ----------------------------------------------------------------------

const metadata = { title: `Arxiv | Moliya | ${CONFIG.appName}` };

export default function ArchivedPage() {
    return (
        <>
            <Helmet>
                <title>{metadata.title}</title>
            </Helmet>

            <ArchivedView />
        </>
    );
}
