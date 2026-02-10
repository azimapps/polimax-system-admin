
import { Helmet } from 'react-helmet-async';

import { StanokListView } from 'src/sections/stanok/view/stanok-list-view';

// ----------------------------------------------------------------------

export default function StanokListPage() {
    return (
        <>
            <Helmet>
                <title> Stanoklar: List | Polimax </title>
            </Helmet>

            <StanokListView />
        </>
    );
}
