import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';
import { LaminatsiyaPanelView } from 'src/sections/laminatsiya-panel/laminatsiya-panel-view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {`Laminatsiya Paneli - ${CONFIG.appName}`}</title>
            </Helmet>

            <LaminatsiyaPanelView />
        </>
    );
}
