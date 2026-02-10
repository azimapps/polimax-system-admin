
import { Helmet } from 'react-helmet-async';

import { StaffArchivedView } from 'src/sections/staff/view/staff-archived-view';

// ----------------------------------------------------------------------

export default function StaffArchivedPage() {
    return (
        <>
            <Helmet>
                <title> Staff: Archived | Polimax </title>
            </Helmet>

            <StaffArchivedView />
        </>
    );
}
