import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetPlanItem } from 'src/hooks/use-plan-items';

import { fDate, fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';


// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    id?: number;
};

export function OrderPlanningDetailDialog({ open, onClose, id }: Props) {
    const { t } = useTranslate('order-planning');
    const { t: tStanok } = useTranslate('stanok');

    const { data: item, isLoading } = useGetPlanItem(Number(id));

    const renderInfoRow = (label: string, value: any) => (
        <Stack direction="row" justifyContent="space-between" sx={{ py: 1 }}>
            <Typography variant="body2" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="subtitle2" sx={{ textAlign: 'right' }}>
                {value || '-'}
            </Typography>
        </Stack>
    );

    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Reja Tafsilotlari {id ? `#${id}` : ''}</Typography>
                <IconButton onClick={onClose}>
                    <Iconify icon="mingcute:close-line" />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <CircularProgress />
                    </Box>
                )}

                {item && (
                    <Scrollbar sx={{ p: 1 }}>
                        <Box
                            gap={3}
                            display="grid"
                            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                        >
                            <Stack spacing={2} component={Paper} variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>Reja Vaqti va Holati</Typography>
                                {renderInfoRow(t('form.start_date'), fDate(item.start_date))}
                                {renderInfoRow(t('form.end_date'), fDate(item.end_date))}
                                {renderInfoRow(t('table.status'), item.status === 'finished' ? t('finished') : t('in_progress'))}
                            </Stack>

                            <Stack spacing={2} component={Paper} variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>Uskuna & Brigada</Typography>
                                {renderInfoRow(t('table.machine'), item.machine?.name)}
                                {renderInfoRow(t('form.machine_type'), item.machine?.type ? tStanok(`type.${item.machine.type}`) : '-')}
                                {renderInfoRow(t('table.brigada'), `${item.brigada?.name || ''} (${item.brigada?.leader || '-'})`)}
                            </Stack>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {item.order && (
                            <Stack spacing={2} component={Paper} variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>Buyurtma Ma&apos;lumotlari</Typography>

                                <Box
                                    gap={2}
                                    display="grid"
                                    gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                                >
                                    <Stack>
                                        {renderInfoRow('Raqami', item.order.order_number)}
                                        {renderInfoRow('Sana', fDateTime(item.order.date))}
                                        {renderInfoRow('Nomi', item.order.title)}
                                        {renderInfoRow('Material', `${item.order.material || ''} ${item.order.sub_material || ''}`)}
                                        {renderInfoRow('Hajmi (kg)', item.order.quantity_kg)}
                                    </Stack>

                                    <Stack>
                                        {renderInfoRow('Qalinligi', item.order.film_thickness)}
                                        {renderInfoRow('Kengligi', item.order.film_width)}
                                        {renderInfoRow('Val uzunligi', item.order.cylinder_length)}
                                        {renderInfoRow('Val soni', item.order.cylinder_count)}
                                        {renderInfoRow('Val aylanmasi', item.order.cylinder_aylanasi)}
                                    </Stack>
                                </Box>
                            </Stack>
                        )}
                    </Scrollbar>
                )}
            </DialogContent>
        </Dialog>
    );
}
