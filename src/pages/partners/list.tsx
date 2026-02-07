import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';
import { PartnerListView } from 'src/sections/partners/view/list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Hamkorlar | ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{metadata.title}</title>
            </Helmet>

            <PartnerListView />
        </>
    );
}
