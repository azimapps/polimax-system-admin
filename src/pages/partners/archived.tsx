import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';
import { PartnerArchivedView } from 'src/sections/partners/view/archived-view';

// ----------------------------------------------------------------------

const metadata = { title: `Arxivlangan Hamkorlar | ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{metadata.title}</title>
            </Helmet>

            <PartnerArchivedView />
        </>
    );
}
