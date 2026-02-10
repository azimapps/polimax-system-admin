
import { Helmet } from 'react-helmet-async';

import { StaffListView } from 'src/sections/staff/view/staff-list-view';

// ----------------------------------------------------------------------

export default function StaffListPage() {
    return (
        <>
            <Helmet>
                <title> Staff: List | Polimax </title>
            </Helmet>

            <StaffListView />
        </>
    );
}
