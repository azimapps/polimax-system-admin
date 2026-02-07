import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';
import { KlientlarListView } from 'src/sections/klientlar/view/list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Klientlar | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <KlientlarListView />
    </>
  );
}
