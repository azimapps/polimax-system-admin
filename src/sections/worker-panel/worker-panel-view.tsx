import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { usePathname } from 'src/routes/hooks';

import { InProgressView } from './view/in-progress-view';

export function WorkerPanelView() {
    const pathname = usePathname();

    // Determine current tab from pathname
    let currentTab = 'jarayonda';
    if (pathname.includes('/finished')) currentTab = 'finished';
    else if (pathname.includes('/materials')) currentTab = 'materials';
    else if (pathname.includes('/sushka')) currentTab = 'sushka';

    if (currentTab === 'jarayonda') {
        return (
            <Container maxWidth="xl" sx={{ py: 3, display: 'flex', gap: 3 }}>
                <InProgressView />
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3, display: 'flex', gap: 3 }}>
            <Box sx={{ flexGrow: 1 }}>
                <Card sx={{ p: 3, borderRadius: 2, bgcolor: '#1C252E', minHeight: 400 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        {currentTab === 'finished' && 'Yakunlangan vazifalar'}
                        {currentTab === 'materials' && 'Materiallar'}
                        {currentTab === 'sushka' && 'Sushka paneli'}
                    </Typography>
                    <Typography color="text.secondary">
                        Tez orada qo&apos;shiladi...
                    </Typography>
                </Card>
            </Box>
        </Container>
    );
}
