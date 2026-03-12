import type { StaffSalaryDetailResponse } from 'src/types/salary';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetStaffSalaryDetail } from 'src/hooks/use-salary';

import { fNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const WORK_TYPE_LABELS: Record<string, string> = {
    tayyor_mahsulotlar_reskasi: 'work_types.tayyor_mahsulotlar_reskasi',
    tayyor_mahsulot_peremotkasi: 'work_types.tayyor_mahsulot_peremotkasi',
    plyonka_peremotkasi: 'work_types.plyonka_peremotkasi',
    reska_3_5_sm: 'work_types.reska_3_5_sm',
    asobiy_tarif: 'work_types.asobiy_tarif',
};

const KPI_RATE_LABELS: Record<string, string> = {
    kpi_salary: 'kpi_rate_labels.kpi_salary',
    kpi_tayyor_mahsulotlar_reskasi: 'work_types.tayyor_mahsulotlar_reskasi',
    kpi_tayyor_mahsulot_peremotkasi: 'work_types.tayyor_mahsulot_peremotkasi',
    kpi_plyonka_peremotkasi: 'work_types.plyonka_peremotkasi',
    kpi_3_5_sm_reska: 'work_types.reska_3_5_sm',
    kpi_asobiy_tarif: 'work_types.asobiy_tarif',
};

// ----------------------------------------------------------------------

type Props = {
    staffId: number;
    onClose: () => void;
};

export function SalaryDetailDialog({ staffId, onClose }: Props) {
    const { t } = useTranslate('salary');
    const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

    const { data, isLoading } = useGetStaffSalaryDetail(staffId, undefined, true);

    const detail = data as StaffSalaryDetailResponse | undefined;

    return (
        <Dialog open={staffId > 0} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
                <Iconify icon="solar:wad-of-money-bold" width={24} sx={{ color: '#059669' }} />
                {t('detail_title')}
                {detail && ` — ${detail.fullname}`}
            </DialogTitle>

            <DialogContent dividers>
                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress />
                    </Box>
                )}

                {!isLoading && detail && (
                    <Stack spacing={3}>
                        {/* Header info */}
                        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                            <Chip label={detail.staff_type} size="small" sx={{ textTransform: 'capitalize', fontWeight: 600 }} />
                            {detail.worker_type && (
                                <Chip label={detail.worker_type} size="small" variant="outlined" sx={{ textTransform: 'capitalize', fontWeight: 600 }} />
                            )}
                            <Box sx={{ flex: 1 }} />
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                {t('fixed_salary')}:
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                {fNumber(detail.fixed_salary)} UZS
                            </Typography>
                        </Box>

                        {/* KPI Rates */}
                        {detail.kpi_rates && (
                            <>
                                <Divider />
                                <Box>
                                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: '#475569' }}>
                                        {t('kpi_rates')}
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 0.5, px: 1 }}>
                                        {Object.entries(detail.kpi_rates).map(([key, value]) => (
                                            <Box key={key} sx={{ display: 'contents' }}>
                                                <Typography variant="body2" sx={{ color: '#475569' }}>
                                                    {KPI_RATE_LABELS[key] ? t(KPI_RATE_LABELS[key]) : key}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        textAlign: 'right',
                                                        fontWeight: 600,
                                                        color: value ? '#059669' : '#94a3b8',
                                                    }}
                                                >
                                                    {value ? `${fNumber(value)} UZS/m` : t('no_rate')}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </>
                        )}

                        {/* Monthly History */}
                        <Divider />
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: '#475569' }}>
                                {t('monthly_history')}
                            </Typography>

                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={40} />
                                        <TableCell>{t('month')}</TableCell>
                                        <TableCell align="right">{t('fixed_salary')}</TableCell>
                                        <TableCell align="right">{t('kpi_amount')}</TableCell>
                                        <TableCell align="right">{t('total')}</TableCell>
                                        <TableCell align="center">{t('status')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {detail.records.map((rec) => {
                                        const monthKey = `${rec.year}-${rec.month}`;
                                        const hasKpi = rec.kpi_breakdown?.length > 0;
                                        const isExpanded = expandedMonth === monthKey;

                                        return (
                                            <Box key={monthKey} component="tbody" sx={{ display: 'contents' }}>
                                                <TableRow
                                                    hover
                                                    sx={{ cursor: hasKpi ? 'pointer' : 'default' }}
                                                    onClick={() => hasKpi && setExpandedMonth(isExpanded ? null : monthKey)}
                                                >
                                                    <TableCell>
                                                        {hasKpi && (
                                                            <Iconify
                                                                icon={isExpanded ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
                                                                width={16}
                                                                sx={{ color: '#94a3b8' }}
                                                            />
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            {t(`months.${rec.month}`)} {rec.year}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2">
                                                            {fNumber(rec.fixed_amount)} UZS
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="body2" sx={{ color: rec.kpi_amount > 0 ? '#059669' : '#94a3b8' }}>
                                                            {rec.kpi_amount > 0 ? `+${fNumber(rec.kpi_amount)}` : '—'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                            {fNumber(rec.total_amount)} UZS
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={t(rec.status)}
                                                            size="small"
                                                            color={
                                                                rec.status === 'paid' ? 'success' :
                                                                rec.status === 'confirmed' ? 'warning' :
                                                                'info'
                                                            }
                                                            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                                                        />
                                                    </TableCell>
                                                </TableRow>

                                                {/* Expandable KPI breakdown per month */}
                                                {hasKpi && isExpanded && (
                                                    <TableRow>
                                                        <TableCell colSpan={6} sx={{ py: 0, bgcolor: '#f8fafc' }}>
                                                            <Collapse in timeout="auto">
                                                                <Box sx={{ py: 1.5, px: 2 }}>
                                                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px 140px', gap: 0.5 }}>
                                                                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                                                                            {t('work_type')}
                                                                        </Typography>
                                                                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>
                                                                            {t('meters')}
                                                                        </Typography>
                                                                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>
                                                                            {t('rate')}
                                                                        </Typography>
                                                                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>
                                                                            {t('subtotal')}
                                                                        </Typography>
                                                                        {rec.kpi_breakdown.map((kpi, idx) => (
                                                                            <Box key={idx} sx={{ display: 'contents' }}>
                                                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                                    {WORK_TYPE_LABELS[kpi.work_type]
                                                                                        ? t(WORK_TYPE_LABELS[kpi.work_type])
                                                                                        : t('work_types.default')}
                                                                                </Typography>
                                                                                <Typography variant="body2" sx={{ textAlign: 'right' }}>
                                                                                    {fNumber(kpi.meters)}
                                                                                </Typography>
                                                                                <Typography variant="body2" sx={{ textAlign: 'right', color: '#64748b' }}>
                                                                                    {fNumber(kpi.rate)} UZS/m
                                                                                </Typography>
                                                                                <Typography variant="body2" sx={{ textAlign: 'right', fontWeight: 600, color: '#059669' }}>
                                                                                    {fNumber(kpi.subtotal)} UZS
                                                                                </Typography>
                                                                            </Box>
                                                                        ))}
                                                                    </Box>
                                                                </Box>
                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </Box>
                                        );
                                    })}

                                    {detail.records.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 3, color: '#94a3b8' }}>
                                                {t('no_data')}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Box>

                        {/* Summary */}
                        <Divider />
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                            <Box sx={{ p: 2, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0', textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600 }}>
                                    {t('total_earned')}
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#15803d', fontWeight: 800, lineHeight: 1.2 }}>
                                    {fNumber(detail.summary.total_earned)} UZS
                                </Typography>
                            </Box>
                            <Box sx={{ p: 2, bgcolor: '#eff6ff', borderRadius: 2, border: '1px solid #bfdbfe', textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ color: '#1e40af', fontWeight: 600 }}>
                                    {t('total_paid')}
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#1d4ed8', fontWeight: 800, lineHeight: 1.2 }}>
                                    {fNumber(detail.summary.total_paid)} UZS
                                </Typography>
                            </Box>
                            <Box sx={{ p: 2, bgcolor: detail.summary.total_unpaid > 0 ? '#fef2f2' : '#f8fafc', borderRadius: 2, border: `1px solid ${detail.summary.total_unpaid > 0 ? '#fecaca' : '#e2e8f0'}`, textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ color: detail.summary.total_unpaid > 0 ? '#991b1b' : '#64748b', fontWeight: 600 }}>
                                    {t('total_unpaid')}
                                </Typography>
                                <Typography variant="h6" sx={{ color: detail.summary.total_unpaid > 0 ? '#dc2626' : '#94a3b8', fontWeight: 800, lineHeight: 1.2 }}>
                                    {fNumber(detail.summary.total_unpaid)} UZS
                                </Typography>
                            </Box>
                        </Box>
                    </Stack>
                )}
            </DialogContent>
        </Dialog>
    );
}
