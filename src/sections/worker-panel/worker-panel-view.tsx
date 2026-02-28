import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { useGetMyMaterials, useGetMyBrigadaPlanItems } from 'src/hooks/use-worker-panel';

import { Iconify } from 'src/components/iconify';

export function WorkerPanelView() {
    const [currentTab, setCurrentTab] = useState('in_progress');

    // Make sure we pass the correct status to fetch exactly what we need
    const { data: planItems = [], isLoading: isLoadingPlan, error: planError } = useGetMyBrigadaPlanItems(
        currentTab === 'in_progress' ? { status: 'in_progress' } :
            currentTab === 'finished' ? { status: 'finished' } : {}
    );
    const { data: materials = [], isLoading: isLoadingMaterials, error: materialsError } = useGetMyMaterials({});

    const renderTabs = (
        <Card sx={{ width: 280, flexShrink: 0, p: 2, borderRadius: 2 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1, pl: 2 }}>
                PECHAT PANELI
            </Typography>
            <Tabs
                value={currentTab}
                onChange={(e, v) => setCurrentTab(v)}
                orientation="vertical"
                sx={{
                    '& .MuiTab-root': {
                        justifyContent: 'flex-start',
                        minHeight: 48,
                        borderRadius: 1,
                        mb: 0.5,
                        px: 2,
                        textTransform: 'none',
                    },
                    '& .Mui-selected': {
                        bgcolor: 'action.selected',
                    },
                    '& .MuiTabs-indicator': {
                        display: 'none',
                    }
                }}
            >
                <Tab icon={<Iconify icon="solar:chart-square-outline" sx={{ mr: 1.5 }} />} iconPosition="start" label="Jarayonda" value="in_progress" />
                <Tab icon={<Iconify icon="solar:clock-circle-bold" sx={{ mr: 1.5 }} />} iconPosition="start" label="Yakunlangan" value="finished" />
                <Tab icon={<Iconify icon="solar:inbox-bold" sx={{ mr: 1.5 }} />} iconPosition="start" label="Materiallar" value="materials" />
                <Tab icon={<Iconify icon="solar:info-circle-bold" sx={{ mr: 1.5 }} />} iconPosition="start" label="Sushka paneli" value="sushka" />
            </Tabs>
        </Card>
    );

    const renderPlanTable = () => (
        <Card sx={{ flexGrow: 1, p: 3, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>Pechat umumiy</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
                Reja bo&apos;yicha bosmaga biriktirilgan buyurtmalar tanlangan stanok va brigada bo&apos;yicha ko&apos;rinadi.
            </Typography>

            <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
                <TextField
                    label="Stanok"
                    value={planItems[0] ? `Stanok ${planItems[0].machine_id}` : (isLoadingPlan ? 'Stanok yuklanmoqda...' : 'Stanok aniqlanmadi')}
                    disabled
                    fullWidth
                />
                <TextField
                    label="Brigada"
                    value={planItems[0] ? `Brigada ${planItems[0].brigada_id}` : (isLoadingPlan ? 'Brigada yuklanmoqda...' : 'Brigada aniqlanmadi')}
                    disabled
                    fullWidth
                />
            </Stack>

            <Alert severity="info" sx={{ mb: 3, bgcolor: 'background.neutral' }}>
                <Typography variant="body2">
                    Tanlangan: {planItems[0] ? `stanok ${planItems[0].machine_id} - brigada ${planItems[0].brigada_id}` : '...'}
                </Typography>
            </Alert>

            <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'background.neutral' }}>
                        <TableRow>
                            <TableCell>Buyurtma ID</TableCell>
                            <TableCell>Boshlanish vaqti</TableCell>
                            <TableCell>Tugash vaqti</TableCell>
                            <TableCell>Holati</TableCell>
                            <TableCell align="center">Amallar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoadingPlan ? (
                            <TableRow><TableCell colSpan={5} align="center">Yuklanmoqda...</TableCell></TableRow>
                        ) : planItems.length === 0 ? (
                            <TableRow><TableCell colSpan={5} align="center">
                                <Typography color={planError ? 'error.main' : 'text.secondary'}>
                                    {planError
                                        ? ((planError as any)?.response?.data?.detail || (planError as Error)?.message || 'Xatolik yuz berdi')
                                        : 'Vazifalar yo\'q'}
                                </Typography>
                            </TableCell></TableRow>
                        ) : planItems.map((item) => (
                            <TableRow key={item.id} hover>
                                <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                    {`ORD-${item.order_id}`}
                                </TableCell>
                                <TableCell>
                                    {item.start_date ? new Date(item.start_date).toLocaleString('uz-UZ') : '-'}
                                </TableCell>
                                <TableCell>
                                    {item.end_date ? new Date(item.end_date).toLocaleString('uz-UZ') : '-'}
                                </TableCell>
                                <TableCell>
                                    <Box sx={{
                                        color: item.status === 'finished' ? 'success.main' : 'warning.main',
                                        bgcolor: item.status === 'finished' ? 'success.lighter' : 'warning.lighter',
                                        px: 1, py: 0.5, borderRadius: 1, display: 'inline-flex', fontSize: '0.75rem', fontWeight: 'bold'
                                    }}>
                                        {item.status === 'finished' ? 'Yakunlangan' : 'Jarayonda'}
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton size="small" sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                                        <Iconify icon="solar:info-circle-bold" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );

    const renderMaterialsTable = () => (
        <Card sx={{ flexGrow: 1, p: 3, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>Materiallar</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
                Ombordan stanokga kelib tushgan materiallar ro&apos;yxati.
            </Typography>

            <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'background.neutral' }}>
                        <TableRow>
                            <TableCell>Material</TableCell>
                            <TableCell>Turi</TableCell>
                            <TableCell>Miqdor</TableCell>
                            <TableCell>Sana</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoadingMaterials ? (
                            <TableRow><TableCell colSpan={4} align="center">Yuklanmoqda...</TableCell></TableRow>
                        ) : materials.length === 0 ? (
                            <TableRow><TableCell colSpan={4} align="center">
                                <Typography color={materialsError ? 'error.main' : 'text.secondary'}>
                                    {materialsError
                                        ? ((materialsError as any)?.response?.data?.detail || (materialsError as Error)?.message || 'Xatolik yuz berdi')
                                        : 'Materiallar yo\'q'}
                                </Typography>
                            </TableCell></TableRow>
                        ) : materials.map((item) => (
                            <TableRow key={item.id} hover>
                                <TableCell>{item.notes || 'Nomsiz'}</TableCell>
                                <TableCell>
                                    <Box sx={{
                                        color: item.transaction_type === 'kirim' ? 'success.main' : 'error.main',
                                        bgcolor: item.transaction_type === 'kirim' ? 'success.lighter' : 'error.lighter',
                                        px: 1, py: 0.5, borderRadius: 1, display: 'inline-flex', fontSize: '0.75rem', fontWeight: 'bold'
                                    }}>
                                        {item.transaction_type === 'kirim' ? 'Kirim (+)' : 'Chiqim (-)'}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {item.quantity_kg ? `${item.quantity_kg} kg` :
                                        item.quantity_liter ? `${item.quantity_liter} L` :
                                            item.quantity_count ? `${item.quantity_count} dona` :
                                                item.quantity_barrels ? `${item.quantity_barrels} barrel` : '-'}
                                </TableCell>
                                <TableCell>{new Date(item.date).toLocaleString('uz-UZ')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );

    return (
        <Container maxWidth="xl" sx={{ py: 3, display: 'flex', gap: 3 }}>
            {renderTabs}

            {(currentTab === 'in_progress' || currentTab === 'finished') && renderPlanTable()}
            {currentTab === 'materials' && renderMaterialsTable()}
            {currentTab === 'sushka' && (
                <Card sx={{ flexGrow: 1, p: 3, borderRadius: 2 }}>
                    <Typography variant="h5">Sushka paneli</Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>Tez kunda...</Typography>
                </Card>
            )}
        </Container>
    );
}
