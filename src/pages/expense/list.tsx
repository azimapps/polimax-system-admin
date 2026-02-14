import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';
import { ExpenseListView } from 'src/sections/expense/view/expense-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Xarajatlar | ${CONFIG.appName}` };

export default function ExpenseListPage() {
    return (
        <>
            <Helmet>
                <title>{metadata.title}</title>
            </Helmet>

            <ExpenseListView />
        </>
    );
}
