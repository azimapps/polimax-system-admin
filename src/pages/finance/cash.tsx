import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';
import { CashView } from 'src/sections/finance/view/cash-view';

// ----------------------------------------------------------------------

const metadata = { title: `Naqd pul | Moliya | ${CONFIG.appName}` };

export default function CashPage() {
    return (
        <>
            <Helmet>
                <title>{metadata.title}</title>
            </Helmet>

            <CashView />
        </>
    );
}
