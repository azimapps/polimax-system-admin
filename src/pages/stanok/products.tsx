
import { Helmet } from 'react-helmet-async';

import { StanokProductsView } from 'src/sections/stanok/view';

// ----------------------------------------------------------------------

export default function StanokProductsPage() {
    return (
        <>
            <Helmet>
                <title> Dashboard: Stanok Products</title>
            </Helmet>

            <StanokProductsView />
        </>
    );
}
