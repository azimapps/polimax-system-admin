
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';
import { DashboardView } from 'src/sections/dashboard/view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {CONFIG.appName} - Dashboard </title>
            </Helmet>

            <DashboardView />
        </>
    );
}
