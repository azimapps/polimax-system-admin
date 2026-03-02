import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';
import { StaffDebtView } from 'src/sections/finance/staff-debt/staff-debt-view';

// ----------------------------------------------------------------------

const metadata = { title: `Xodimlar Qarzi | Moliya | ${CONFIG.appName}` };

export default function StaffDebtPage() {
    return (
        <>
            <Helmet>
                <title>{metadata.title}</title>
            </Helmet>

            <StaffDebtView />
        </>
    );
}
