import type { GridColDef } from '@mui/x-data-grid';
import type { SalaryPreviewItem, StaffSalaryDetailResponse } from 'src/types/salary';

import { toast } from 'sonner';
import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { DataGrid } from '@mui/x-data-grid';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { usePaySalary, useConfirmSalary, useGetSalaryPreview, useGetSalaryRecords, useGetStaffSalaryDetail } from 'src/hooks/use-salary';

import { fNumber } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

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

export function SalaryView() {
    const { t } = useTranslate('salary');
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [tab, setTab] = useState(0);
    const [detailStaffId, setDetailStaffId] = useState<number>(0);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [payOpen, setPayOpen] = useState(false);

    // Data
    const { data: preview, isLoading: previewLoading } = useGetSalaryPreview(year, month);
    const { data: records = [], isLoading: recordsLoading } = useGetSalaryRecords({ year, month });
    const confirmMutation = useConfirmSalary();
    const payMutation = usePaySalary();

    // Year options (last 3 years)
    const yearOptions = useMemo(() => {
        const y = now.getFullYear();
        return [y - 2, y - 1, y, y + 1];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleConfirm = async () => {
        try {
            await confirmMutation.mutateAsync({ year, month });
            toast.success('Маошлар тасдиқланди', { position: 'top-center' });
            setConfirmOpen(false);
            setTab(1); // Switch to confirmed tab
        } catch (error: any) {
            toast.error(error?.response?.data?.detail || 'Xatolik yuz berdi', { position: 'top-center' });
        }
    };

    const handlePay = async () => {
        try {
            await payMutation.mutateAsync({
                salary_record_ids: selectedIds,
                payment_method: 'cash',
            });
            toast.success('Маошлар тўланди', { position: 'top-center' });
            setPayOpen(false);
            setSelectedIds([]);
        } catch (error: any) {
            toast.error(error?.response?.data?.detail || 'Xatolik yuz berdi', { position: 'top-center' });
        }
    };

    // Preview table columns
    const previewColumns: GridColDef[] = useMemo(
        () => [
            {
                field: 'detail',
                headerName: '',
                width: 50,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                    <Tooltip title={t('detail_title')}>
                        <IconButton
                            size="small"
                            onClick={() => setDetailStaffId(params.row.staff_id)}
                            sx={{ color: '#059669' }}
                        >
                            <Iconify icon="solar:wad-of-money-bold" width={20} />
                        </IconButton>
                    </Tooltip>
                ),
            },
            {
                field: 'fullname',
                headerName: t('staff_name'),
                flex: 1,
                minWidth: 180,
            },
            {
                field: 'staff_type',
                headerName: t('staff_type'),
                width: 120,
                renderCell: (params) => (
                    <Chip
                        label={params.value}
                        size="small"
                        sx={{ textTransform: 'capitalize', fontWeight: 600, fontSize: '0.7rem' }}
                    />
                ),
            },
            {
                field: 'worker_type',
                headerName: t('worker_type'),
                width: 120,
                renderCell: (params) =>
                    params.value ? (
                        <Chip
                            label={params.value}
                            size="small"
                            variant="outlined"
                            sx={{ textTransform: 'capitalize', fontWeight: 600, fontSize: '0.7rem' }}
                        />
                    ) : (
                        '—'
                    ),
            },
            {
                field: 'fixed_amount',
                headerName: t('fixed_salary'),
                width: 160,
                align: 'right',
                headerAlign: 'right',
                renderCell: (params) => (
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {fNumber(params.value)} UZS
                    </Typography>
                ),
            },
            {
                field: 'kpi_amount',
                headerName: t('kpi_amount'),
                width: 160,
                align: 'right',
                headerAlign: 'right',
                renderCell: (params) => (
                    <Typography variant="body2" sx={{ fontWeight: 500, color: params.value > 0 ? '#059669' : '#94a3b8' }}>
                        {params.value > 0 ? `+${fNumber(params.value)} UZS` : '—'}
                    </Typography>
                ),
            },
            {
                field: 'total_amount',
                headerName: t('total'),
                width: 180,
                align: 'right',
                headerAlign: 'right',
                renderCell: (params) => (
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        {fNumber(params.value)} UZS
                    </Typography>
                ),
            },
        ],
        [t]
    );

    // Confirmed records columns
    const recordColumns: GridColDef[] = useMemo(
        () => [
            {
                field: 'detail',
                headerName: '',
                width: 50,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                    <Tooltip title={t('detail_title')}>
                        <IconButton
                            size="small"
                            onClick={() => setDetailStaffId(params.row.staff_id)}
                            sx={{ color: '#059669' }}
                        >
                            <Iconify icon="solar:wad-of-money-bold" width={20} />
                        </IconButton>
                    </Tooltip>
                ),
            },
            {
                field: 'fullname',
                headerName: t('staff_name'),
                flex: 1,
                minWidth: 180,
                valueGetter: (_value: any, row: any) => row.fullname || `Staff #${row.staff_id}`,
            },
            {
                field: 'staff_type',
                headerName: t('staff_type'),
                width: 120,
                renderCell: (params) => (
                    <Chip label={params.value} size="small" sx={{ textTransform: 'capitalize', fontWeight: 600, fontSize: '0.7rem' }} />
                ),
            },
            {
                field: 'fixed_amount',
                headerName: t('fixed_salary'),
                width: 150,
                align: 'right',
                headerAlign: 'right',
                renderCell: (params) => <Typography variant="body2">{fNumber(params.value)} UZS</Typography>,
            },
            {
                field: 'kpi_amount',
                headerName: t('kpi_amount'),
                width: 150,
                align: 'right',
                headerAlign: 'right',
                renderCell: (params) => (
                    <Typography variant="body2" sx={{ color: params.value > 0 ? '#059669' : '#94a3b8' }}>
                        {params.value > 0 ? `+${fNumber(params.value)}` : '—'}
                    </Typography>
                ),
            },
            {
                field: 'total_amount',
                headerName: t('total'),
                width: 160,
                align: 'right',
                headerAlign: 'right',
                renderCell: (params) => (
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {fNumber(params.value)} UZS
                    </Typography>
                ),
            },
            {
                field: 'status',
                headerName: t('status'),
                width: 140,
                renderCell: (params) => (
                    <Chip
                        label={t(params.value)}
                        size="small"
                        color={params.value === 'paid' ? 'success' : 'warning'}
                        sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                    />
                ),
            },
            {
                field: 'confirmed_at',
                headerName: t('confirmed_at'),
                width: 160,
                renderCell: (params) => (params.value ? fDateTime(params.value) : '—'),
            },
            {
                field: 'paid_at',
                headerName: t('paid_at'),
                width: 160,
                renderCell: (params) => (params.value ? fDateTime(params.value) : '—'),
            },
        ],
        [t]
    );

    const previewRows = preview?.items || [];
    const grandTotal = preview?.grand_total || 0;

    return (
        <Container maxWidth="xl">
            <CustomBreadcrumbs
                heading={t('title')}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Xodimlar', href: paths.dashboard.staff.list },
                    { name: t('title') },
                ]}
                sx={{ mb: 3 }}
            />

            {/* Filters */}
            <Card sx={{ p: 2.5, mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                        <InputLabel>{t('year')}</InputLabel>
                        <Select label={t('year')} value={year} onChange={(e) => setYear(Number(e.target.value))}>
                            {yearOptions.map((y) => (
                                <MenuItem key={y} value={y}>{y}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel>{t('month')}</InputLabel>
                        <Select label={t('month')} value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                <MenuItem key={m} value={m}>{t(`months.${m}`)}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ flex: 1 }} />

                    {/* Grand total */}
                    {tab === 0 && grandTotal > 0 && (
                        <Box sx={{ px: 2.5, py: 1, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0' }}>
                            <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600 }}>
                                {t('grand_total')}
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#15803d', fontWeight: 800, lineHeight: 1 }}>
                                {fNumber(grandTotal)} UZS
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </Card>

            {/* Tabs + Actions */}
            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                        <Tab label={t('preview_tab')} />
                        <Tab label={t('confirmed_tab')} />
                    </Tabs>

                    <Stack direction="row" spacing={1} sx={{ py: 1 }}>
                        {tab === 0 && previewRows.length > 0 && (
                            <Button
                                variant="contained"
                                color="warning"
                                size="small"
                                startIcon={<Iconify icon="solar:check-circle-bold" width={18} />}
                                onClick={() => setConfirmOpen(true)}
                                loading={confirmMutation.isPending}
                            >
                                {t('confirm_all')}
                            </Button>
                        )}
                        {tab === 1 && selectedIds.length > 0 && (
                            <Button
                                variant="contained"
                                color="success"
                                size="small"
                                startIcon={<Iconify icon="solar:wad-of-money-bold" width={18} />}
                                onClick={() => setPayOpen(true)}
                                loading={payMutation.isPending}
                            >
                                {t('pay_selected')} ({selectedIds.length})
                            </Button>
                        )}
                    </Stack>
                </Box>

                {/* Preview Tab */}
                {tab === 0 && (
                    <DataGrid
                        rows={previewRows}
                        columns={previewColumns}
                        loading={previewLoading}
                        getRowId={(row: SalaryPreviewItem) => row.staff_id}
                        autoHeight
                        disableRowSelectionOnClick
                        pageSizeOptions={[25, 50, 100]}
                        initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
                        localeText={{ noRowsLabel: t('no_data') }}
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-cell': { borderColor: '#f1f5f9' },
                        }}
                    />
                )}

                {/* Confirmed Tab */}
                {tab === 1 && (
                    <DataGrid
                        rows={records}
                        columns={recordColumns}
                        loading={recordsLoading}
                        autoHeight
                        checkboxSelection
                        disableRowSelectionOnClick
                        rowSelectionModel={selectedIds}
                        onRowSelectionModelChange={(ids) => setSelectedIds(ids as number[])}
                        isRowSelectable={(params) => params.row.status === 'confirmed'}
                        pageSizeOptions={[25, 50, 100]}
                        initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
                        localeText={{ noRowsLabel: t('no_data') }}
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-cell': { borderColor: '#f1f5f9' },
                        }}
                    />
                )}
            </Card>

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                title={t('confirm_title')}
                content={t('confirm_message', { year, month: t(`months.${month}`) })}
                action={
                    <Button variant="contained" color="warning" onClick={handleConfirm} disabled={confirmMutation.isPending}>
                        {t('confirm_all')}
                    </Button>
                }
            />

            {/* Pay Dialog */}
            <ConfirmDialog
                open={payOpen}
                onClose={() => setPayOpen(false)}
                title={t('pay_title')}
                content={t('pay_message', { count: selectedIds.length })}
                action={
                    <Button variant="contained" color="success" onClick={handlePay} disabled={payMutation.isPending}>
                        {t('pay_selected')}
                    </Button>
                }
            />

            {/* Salary Detail Dialog */}
            <SalaryDetailDialog
                staffId={detailStaffId}
                onClose={() => setDetailStaffId(0)}
            />
        </Container>
    );
}

// ----------------------------------------------------------------------

function SalaryDetailDialog({ staffId, onClose }: { staffId: number; onClose: () => void }) {
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
