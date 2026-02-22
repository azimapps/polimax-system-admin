import type { PlanItemListItem } from 'src/types/plan-item';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { PlanItemStatus } from 'src/types/plan-item';

// ----------------------------------------------------------------------

type Props = {
    planItems: PlanItemListItem[];
    loading: boolean;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
};

export function OrderPlanningTable({ planItems, loading, onEdit, onDelete }: Props) {
    const { t } = useTranslate('order-planning');

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>{t('table.order')}</TableCell>
                        <TableCell>{t('table.machine')}</TableCell>
                        <TableCell>{t('table.brigada')}</TableCell>
                        <TableCell>{t('table.start_date')}</TableCell>
                        <TableCell>{t('table.end_date')}</TableCell>
                        <TableCell>{t('table.status')}</TableCell>
                        <TableCell align="right">{t('table.actions')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {planItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.order_id}</TableCell>
                            <TableCell>{item.machine_id}</TableCell>
                            <TableCell>{item.brigada_id}</TableCell>
                            <TableCell>{fDate(item.start_date)}</TableCell>
                            <TableCell>{fDate(item.end_date)}</TableCell>
                            <TableCell>
                                {item.status === PlanItemStatus.FINISHED ? t('finished') : t('in_progress')}
                            </TableCell>
                            <TableCell align="right">
                                <IconButton color="inherit" onClick={() => onEdit(item.id)}>
                                    <Iconify icon="solar:pen-bold" />
                                </IconButton>
                                <IconButton color="error" onClick={() => onDelete(item.id)}>
                                    <Iconify icon="solar:trash-bin-trash-bold" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}

                    {planItems.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={8} sx={{ py: 3 }}>
                                <EmptyContent title={t('table.no_data')} sx={{ py: 3 }} />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
