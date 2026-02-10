
import { Helmet } from 'react-helmet-async';

import { StanokBrigadesView } from 'src/sections/stanok/view';

// ----------------------------------------------------------------------

export default function StanokBrigadesPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Stanok Brigades</title>
            </Helmet>

            <StanokBrigadesView />
        </>
    );
}
