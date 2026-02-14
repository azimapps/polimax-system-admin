import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';
import { ExpenseArchivedView } from 'src/sections/expense/view/expense-archived-view';

// ----------------------------------------------------------------------

const metadata = { title: `Arxivlangan xarajatlar | ${CONFIG.appName}` };

export default function ExpenseArchivedPage() {
    return (
        <>
            <Helmet>
                <title>{metadata.title}</title>
            </Helmet>

            <ExpenseArchivedView />
        </>
    );
}
