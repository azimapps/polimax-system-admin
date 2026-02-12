import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';
import { BankView } from 'src/sections/finance/view/bank-view';

// ----------------------------------------------------------------------

const metadata = { title: `Perechisleniya | Moliya | ${CONFIG.appName}` };

export default function TransferPage() {
    return (
        <>
            <Helmet>
                <title>{metadata.title}</title>
            </Helmet>

            <BankView />
        </>
    );
}
