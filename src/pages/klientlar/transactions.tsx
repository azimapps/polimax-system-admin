import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/global-config';
import { ClientTransactionsView } from 'src/sections/klientlar/view/transactions-view';

// ----------------------------------------------------------------------

const metadata = { title: `Tranzaksiyalar | Klientlar | ${CONFIG.appName}` };

export default function ClientTransactionsPage() {
    const { id } = useParams<{ id: string }>();

    return (
        <>
            <Helmet>
                <title>{metadata.title}</title>
            </Helmet>

            <ClientTransactionsView clientId={Number(id)} />
        </>
    );
}
