
import { Helmet } from 'react-helmet-async';

import { StanokArchivedView } from 'src/sections/stanok/view/stanok-archived-view';

// ----------------------------------------------------------------------

export default function StanokArchivedPage() {
    return (
        <>
            <Helmet>
                <title> Stanoklar: Archived | Polimax </title>
            </Helmet>

            <StanokArchivedView />
        </>
    );
}
