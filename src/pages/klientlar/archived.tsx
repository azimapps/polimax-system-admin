import { Helmet } from 'react-helmet-async';

import { KlientlarArchivedView } from 'src/sections/klientlar/view/archived-view';

// ----------------------------------------------------------------------

export default function KlientlarArchivedPage() {
    return (
        <>
            <Helmet>
                <title> Klientlar: Arxiv</title>
            </Helmet>

            <KlientlarArchivedView />
        </>
    );
}
