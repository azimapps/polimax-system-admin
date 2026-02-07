import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';
import { KlientlarDetailView } from 'src/sections/klientlar/view/detail-view';

// ----------------------------------------------------------------------

const metadata = { title: `Client Details | ${CONFIG.appName}` };

export default function Page() {
    const { id } = useParams();

    return (
        <>
            <Helmet>
                <title>{metadata.title}</title>
            </Helmet>

            <KlientlarDetailView id={Number(id)} />
        </>
    );
}
