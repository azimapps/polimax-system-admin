import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';
import { WorkerPanelView } from 'src/sections/worker-panel/worker-panel-view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {`Pechat Paneli - ${CONFIG.appName}`}</title>
            </Helmet>

            <WorkerPanelView />
        </>
    );
}
