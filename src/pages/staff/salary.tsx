import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';
import { SalaryView } from 'src/sections/staff/view/salary-view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title>{CONFIG.appName} - Маош</title>
            </Helmet>

            <SalaryView />
        </>
    );
}
