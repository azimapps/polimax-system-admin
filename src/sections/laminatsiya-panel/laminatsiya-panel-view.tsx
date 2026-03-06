import Container from '@mui/material/Container';

import { usePathname } from 'src/routes/hooks';

import { SushkaView } from 'src/sections/worker-panel/view/sushka-view';
import { FinishedView } from 'src/sections/worker-panel/view/finished-view';
import { MaterialsView } from 'src/sections/worker-panel/view/materials-view';
import { InProgressView } from 'src/sections/worker-panel/view/in-progress-view';

import { StanokType } from 'src/types/stanok';

export function LaminatsiyaPanelView() {
    const pathname = usePathname();

    let currentTab = 'jarayonda';
    if (pathname.includes('/finished')) currentTab = 'finished';
    else if (pathname.includes('/materials')) currentTab = 'materials';
    else if (pathname.includes('/sushka')) currentTab = 'sushka';

    if (currentTab === 'jarayonda') {
        return (
            <Container maxWidth="xl" sx={{ py: 3, display: 'flex', gap: 3 }}>
                <InProgressView machineType={StanokType.LAMINATSIYA} translationNs="laminatsiya-panel" />
            </Container>
        );
    }

    if (currentTab === 'materials') {
        return (
            <Container maxWidth="xl" sx={{ py: 3, display: 'flex', gap: 3 }}>
                <MaterialsView machineType={StanokType.LAMINATSIYA} translationNs="laminatsiya-panel" />
            </Container>
        );
    }

    if (currentTab === 'finished') {
        return (
            <Container maxWidth="xl" sx={{ py: 3, display: 'flex', gap: 3 }}>
                <FinishedView machineType={StanokType.LAMINATSIYA} translationNs="laminatsiya-panel" />
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3, display: 'flex', gap: 3 }}>
            <SushkaView translationNs="laminatsiya-panel" />
        </Container>
    );
}
