import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';
import { OmborAccountListView } from 'src/sections/ombor-account/view/ombor-account-list-view';

// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {`Ombor Hisoblari - ${CONFIG.appName}`}</title>
            </Helmet>

            <OmborAccountListView />
        </>
    );
}
