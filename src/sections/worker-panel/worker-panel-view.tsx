import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

export function WorkerPanelView() {
    const [currentTab, setCurrentTab] = useState('in_progress');

    const renderTabs = (
        <Card sx={{ width: 280, flexShrink: 0, p: 2, borderRadius: 2, bgcolor: '#1C252E' }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 2, pl: 2, fontWeight: 'bold' }}>
                PECHAT PANELI
            </Typography>
            <Tabs
                value={currentTab}
                onChange={(e, v) => setCurrentTab(v)}
                orientation="vertical"
                TabIndicatorProps={{ style: { display: 'none' } }}
                sx={{
                    '& .MuiTab-root': {
                        justifyContent: 'flex-start',
                        minHeight: 48,
                        borderRadius: 1,
                        mb: 0.5,
                        px: 2,
                        textTransform: 'none',
                        color: 'text.secondary',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                    },
                    '& .Mui-selected': {
                        bgcolor: 'rgba(0, 167, 111, 0.08)',
                        color: 'primary.main',
                    },
                }}
            >
                <Tab
                    icon={<Iconify icon="solar:chart-square-outline" width={24} sx={{ mr: 2 }} />}
                    iconPosition="start"
                    label="Jarayonda"
                    value="in_progress"
                />
                <Tab
                    icon={<Iconify icon="solar:clock-circle-bold" width={24} sx={{ mr: 2 }} />}
                    iconPosition="start"
                    label="Yakunlangan"
                    value="finished"
                />
                <Tab
                    icon={<Iconify icon="solar:inbox-bold" width={24} sx={{ mr: 2 }} />}
                    iconPosition="start"
                    label="Materiallar"
                    value="materials"
                />
                <Tab
                    icon={<Iconify icon="solar:info-circle-bold" width={24} sx={{ mr: 2 }} />}
                    iconPosition="start"
                    label="Sushka paneli"
                    value="sushka"
                />
            </Tabs>
        </Card>
    );

    return (
        <Container maxWidth="xl" sx={{ py: 3, display: 'flex', gap: 3 }}>
            {renderTabs}

            <Box sx={{ flexGrow: 1 }}>
                <Card sx={{ p: 3, borderRadius: 2, bgcolor: '#1C252E', minHeight: 400 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        {currentTab === 'in_progress' && 'Jarayondagi vazifalar'}
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
