import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';
import { ReskaPanelView } from 'src/sections/reska-panel/reska-panel-view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {`Reska Paneli - ${CONFIG.appName}`}</title>
            </Helmet>

            <ReskaPanelView />
        </>
    );
}
