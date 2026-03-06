import Container from '@mui/material/Container';

import { usePathname } from 'src/routes/hooks';

import { StanokType } from 'src/types/stanok';

import { SushkaView } from './view/sushka-view';
import { FinishedView } from './view/finished-view';
import { MaterialsView } from './view/materials-view';
import { InProgressView } from './view/in-progress-view';

type Props = {
    machineType?: StanokType;
};

export function WorkerPanelView({ machineType = StanokType.PECHAT }: Props) {
    const pathname = usePathname();

    // Determine current tab from pathname
    let currentTab = 'jarayonda';
    if (pathname.includes('/finished')) currentTab = 'finished';
    else if (pathname.includes('/materials')) currentTab = 'materials';
    else if (pathname.includes('/sushka')) currentTab = 'sushka';

    if (currentTab === 'jarayonda') {
        return (
            <Container maxWidth="xl" sx={{ py: 3, display: 'flex', gap: 3 }}>
                <InProgressView machineType={machineType} />
            </Container>
        );
    }

    if (currentTab === 'materials') {
        return (
            <Container maxWidth="xl" sx={{ py: 3, display: 'flex', gap: 3 }}>
                <MaterialsView machineType={machineType} />
            </Container>
        );
    }

    if (currentTab === 'finished') {
        return (
            <Container maxWidth="xl" sx={{ py: 3, display: 'flex', gap: 3 }}>
                <FinishedView machineType={machineType} />
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3, display: 'flex', gap: 3 }}>
            <SushkaView />
        </Container>
    );
}
