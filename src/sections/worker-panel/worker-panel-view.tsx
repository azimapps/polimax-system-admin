import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useGetMyMaterials, useGetMyBrigadaPlanItems } from 'src/hooks/use-worker-panel';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useAuthContext } from 'src/auth/hooks';

export function WorkerPanelView() {
    const { user } = useAuthContext();
    const [currentTab, setCurrentTab] = useState('plan_items');

    const { data: planItems = [], isLoading: isLoadingPlan } = useGetMyBrigadaPlanItems({});
    const { data: materials = [], isLoading: isLoadingMaterials } = useGetMyMaterials({});

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
                <Typography variant="h4">Ishchilar Paneli (My Brigada)</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Iconify icon="solar:user-id-bold" />
                    <Typography variant="subtitle2">{user?.first_name} {user?.last_name}</Typography>
                </Box>
            </Stack>

            <Tabs
                value={currentTab}
                onChange={(e, v) => setCurrentTab(v)}
                sx={{ mb: 3 }}
            >
                <Tab label="Mening vazifalarim (Plan Items)" value="plan_items" />
                <Tab label="Mening materiallarim (Ombor)" value="materials" />
            </Tabs>

            {currentTab === 'plan_items' && (
                <Card sx={{ p: 3 }}>
                    <Scrollbar>
                        {isLoadingPlan ? (
                            <Typography>Yuklanmoqda...</Typography>
                        ) : planItems.length === 0 ? (
                            <Typography color="text.secondary">Vazifalar yo&apos;q</Typography>
                        ) : (
                            <Stack spacing={2}>
                                {planItems.map(item => (
                                    <Box key={item.id} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                        <Typography variant="subtitle1">Vazifa ID: {item.id}</Typography>
                                        <Typography variant="body2">Holati: {item.status}</Typography>
                                        <Typography variant="body2">Boshlanish: {new Date(item.start_date).toLocaleString('uz-UZ')}</Typography>
                                        <Typography variant="body2">Tugash: {new Date(item.end_date).toLocaleString('uz-UZ')}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Scrollbar>
                </Card>
            )}

            {currentTab === 'materials' && (
                <Card sx={{ p: 3 }}>
                    <Scrollbar>
                        {isLoadingMaterials ? (
                            <Typography>Yuklanmoqda...</Typography>
                        ) : materials.length === 0 ? (
                            <Typography color="text.secondary">Materiallar yo&apos;q</Typography>
                        ) : (
                            <Stack spacing={2}>
                                {materials.map(item => (
                                    <Box key={item.id} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                        <Typography variant="subtitle1">Material: {item.notes}</Typography>
                                        <Typography variant="body2">Turi: {item.transaction_type === 'kirim' ? "Kirim (+)" : "Chiqim (-)"}</Typography>
                                        <Typography variant="body2">Miqdor: {item.quantity_kg ? `${item.quantity_kg} kg` : item.quantity_liter ? `${item.quantity_liter} L` : item.quantity_count ? `${item.quantity_count} dona` : '-'}</Typography>
                                        <Typography variant="body2">Sana: {new Date(item.date).toLocaleString('uz-UZ')}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Scrollbar>
                </Card>
            )}
        </Container>
    );
}
