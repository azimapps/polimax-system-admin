import type { OmborItem } from 'src/types/ombor';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { useGetClients } from 'src/hooks/use-clients';
import { useGetPartners } from 'src/hooks/use-partners';
import { useGetMaterials } from 'src/hooks/use-materials';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData, TableSkeleton, TableHeadCustom } from 'src/components/table';

import { OmborType } from 'src/types/ombor';

// ----------------------------------------------------------------------

type Props = {
    type: OmborType;
    items: OmborItem[];
    loading: boolean;
    onHistory: (id: number) => void;
    onTransactions: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
};

export function OmborTable({ type, items, loading, onHistory, onTransactions, onEdit, onDelete }: Props) {
    const { t } = useTranslate('ombor');
    const { data: partners = [] } = useGetPartners();
    const { data: clients = [] } = useGetClients();
    const { data: materials = [] } = useGetMaterials();

    const getExtraColumns = () => {
        const cols: any[] = [];

        if ([OmborType.PLYONKA, OmborType.KRASKA, OmborType.SUYUQ_KRASKA, OmborType.RASTVARITEL, OmborType.SILINDIR, OmborType.KLEY, OmborType.TAYYOR_TOSHKENT, OmborType.TAYYOR_ANGREN].includes(type)) {
            cols.push({ id: 'supplier_id', label: t('form.supplier_id') });
        }
        if ([OmborType.PLYONKA, OmborType.KRASKA, OmborType.SUYUQ_KRASKA, OmborType.RASTVARITEL, OmborType.SILINDIR, OmborType.KLEY, OmborType.ZAPCHASTLAR, OmborType.OTXOT, OmborType.TAYYOR_TOSHKENT, OmborType.TAYYOR_ANGREN].includes(type)) {
            cols.push({ id: 'davaldiylik_id', label: t('form.client_id') });
        }
        if ([OmborType.PLYONKA, OmborType.KRASKA, OmborType.SUYUQ_KRASKA, OmborType.RASTVARITEL, OmborType.SILINDIR].includes(type)) {
            cols.push({ id: 'seriya_number', label: t('form.seriya_number') });
        }
        if ([OmborType.PLYONKA, OmborType.KRASKA, OmborType.SUYUQ_KRASKA, OmborType.OTXOT].includes(type)) {
            cols.push({ id: 'price_per_kg', label: t('form.price_per_kg') });
        }
        if ([OmborType.RASTVARITEL, OmborType.ARALASHMASI].includes(type)) {
            cols.push({ id: 'price_per_liter', label: t('form.price_per_liter') });
        }

        switch (type) {
            case OmborType.PLYONKA:
                cols.push(
                    { id: 'plyonka_category', label: t('form.plyonka_category') },
                    { id: 'plyonka_subcategory', label: t('form.plyonka_subcategory') },
                    { id: 'thickness', label: t('form.thickness') },
                    { id: 'width', label: t('form.width') }
                );
                break;
            case OmborType.KRASKA:
            case OmborType.SUYUQ_KRASKA:
                cols.push(
                    { id: 'color_name', label: t('form.color_name') },
                    { id: 'marka', label: t('form.marka') }
                );
                break;
            case OmborType.RASTVARITEL:
                cols.push(
                    { id: 'solvent_type', label: t('form.solvent_type') }
                );
                break;
            case OmborType.SILINDIR:
                cols.push(
                    { id: 'origin', label: t('form.origin') },
                    { id: 'length', label: t('form.length') },
                    { id: 'diameter', label: t('form.diameter') }
                );
                break;
            case OmborType.KLEY:
                cols.push(
                    { id: 'product_type', label: t('form.product_type') },
                    { id: 'number_identifier', label: t('form.number_identifier') }
                );
                break;
            case OmborType.TAYYOR_TOSHKENT:
            case OmborType.TAYYOR_ANGREN:
                cols.push(
                    { id: 'product_type', label: t('form.product_type') },
                    { id: 'number_identifier', label: t('form.number_identifier') }
                );
                break;
            default:
                break;
        }
        return cols;
    };

    const extraColumns = getExtraColumns();

    const TABLE_HEAD: { id: string; label: string; align?: 'left' | 'center' | 'right'; sx?: any }[] = [
        { id: 'date', label: t('form.date') },
        { id: 'name', label: t('form.name') },
        ...extraColumns,
        { id: 'quantity', label: t('form.quantity'), align: 'center' },
        { id: 'price', label: t('form.price'), align: 'center' },
        { id: 'description', label: t('form.description') },
        {
            id: 'actions',
            label: '',
            align: 'right',
            sx: {
                position: 'sticky',
                right: 0,
                backgroundColor: 'background.neutral',
                zIndex: 1,
                boxShadow: (theme: any) => `-10px 0 20px -10px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.1)'}`,
                borderLeft: (theme: any) => `1px solid ${theme.palette.divider}`,
            }
        },
    ];

    const tableMinWidth = 800 + (extraColumns.length * 150);

    const getQuantityDisplay = (item: OmborItem) => {
        switch (item.ombor_type) {
            case OmborType.PLYONKA:
            case OmborType.KRASKA:
            case OmborType.SUYUQ_KRASKA:
            case OmborType.OTXOT:
                return `${item.total_kg || 0} kg`;
            case OmborType.RASTVARITEL:
            case OmborType.ARALASHMASI:
                return `${item.total_liter || 0} L`;
            case OmborType.SILINDIR:
            case OmborType.KLEY:
            case OmborType.TAYYOR_TOSHKENT:
            case OmborType.TAYYOR_ANGREN:
            case OmborType.ZAPCHASTLAR:
                return `${item.quantity || item.barrels || 0} dona/bochka`;
            default:
                return `${item.quantity || item.total_kg || item.total_liter || 0}`;
        }
    };

    const getPriceDisplay = (item: OmborItem) => {
        let price = item.price || 0;

        if (!price) {
            if (item.price_per_kg && item.total_kg) {
                price = item.price_per_kg * item.total_kg;
            } else if (item.price_per_liter && item.total_liter) {
                price = item.price_per_liter * item.total_liter;
            }
        }

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price || 0);
    };

    const renderExtraCells = (row: OmborItem) => {
        const cellSx = { whiteSpace: 'nowrap' };

        const getSupplierName = (supplierId?: number | null) => {
            if (!supplierId) return '-';
            const partner = partners.find((p) => p.id === supplierId);
            return partner ? partner.fullname : supplierId;
        };

        const getClientName = (clientId?: number | null, davaldiylikId?: number | null) => {
            if (clientId) {
                const client = clients.find((c) => c.id === clientId);
                return client ? client.fullname : clientId;
            }
            if (davaldiylikId) {
                const material = materials.find((m) => m.id === davaldiylikId);
                return material ? material.fullname : davaldiylikId;
            }
            return '-';
        };

        const renderCommonCells = () => (
            <>
                {[OmborType.PLYONKA, OmborType.KRASKA, OmborType.SUYUQ_KRASKA, OmborType.RASTVARITEL, OmborType.SILINDIR, OmborType.KLEY, OmborType.TAYYOR_TOSHKENT, OmborType.TAYYOR_ANGREN].includes(type) && (
                    <TableCell sx={cellSx}>{getSupplierName(row.supplier_id)}</TableCell>
                )}
                {[OmborType.PLYONKA, OmborType.KRASKA, OmborType.SUYUQ_KRASKA, OmborType.RASTVARITEL, OmborType.SILINDIR, OmborType.KLEY, OmborType.ZAPCHASTLAR, OmborType.OTXOT, OmborType.TAYYOR_TOSHKENT, OmborType.TAYYOR_ANGREN].includes(type) && (
                    <TableCell sx={cellSx}>{getClientName(row.client_id, row.davaldiylik_id)}</TableCell>
                )}
                {[OmborType.PLYONKA, OmborType.KRASKA, OmborType.SUYUQ_KRASKA, OmborType.RASTVARITEL, OmborType.SILINDIR].includes(type) && (
                    <TableCell sx={cellSx}>{row.seriya_number || '-'}</TableCell>
                )}
                {[OmborType.PLYONKA, OmborType.KRASKA, OmborType.SUYUQ_KRASKA, OmborType.OTXOT].includes(type) && (
                    <TableCell sx={cellSx}>
                        {row.price_per_kg ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.price_per_kg) : '-'}
                    </TableCell>
                )}
                {[OmborType.RASTVARITEL, OmborType.ARALASHMASI].includes(type) && (
                    <TableCell sx={cellSx}>
                        {row.price_per_liter ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.price_per_liter) : '-'}
                    </TableCell>
                )}
            </>
        );

        switch (type) {
            case OmborType.PLYONKA:
                return (
                    <>
                        {renderCommonCells()}
                        <TableCell sx={cellSx}>{row.plyonka_category ? row.plyonka_category.toUpperCase() : '-'}</TableCell>
                        <TableCell sx={cellSx}>{row.plyonka_subcategory || '-'}</TableCell>
                        <TableCell sx={cellSx}>{row.thickness ? `${row.thickness} mkm` : '-'}</TableCell>
                        <TableCell sx={cellSx}>{row.width ? `${row.width} mm` : '-'}</TableCell>
                    </>
                );
            case OmborType.KRASKA:
            case OmborType.SUYUQ_KRASKA:
                return (
                    <>
                        {renderCommonCells()}
                        <TableCell sx={cellSx}>{row.color_name || '-'}</TableCell>
                        <TableCell sx={cellSx}>{row.marka || '-'}</TableCell>
                    </>
                );
            case OmborType.RASTVARITEL:
                return (
                    <>
                        {renderCommonCells()}
                        <TableCell sx={cellSx}>{row.solvent_type ? row.solvent_type.toUpperCase() : '-'}</TableCell>
                    </>
                );
            case OmborType.SILINDIR:
                return (
                    <>
                        {renderCommonCells()}
                        <TableCell sx={cellSx}>{row.origin ? row.origin.toUpperCase() : '-'}</TableCell>
                        <TableCell sx={cellSx}>{row.length || '-'}</TableCell>
                        <TableCell sx={cellSx}>{row.diameter || '-'}</TableCell>
                    </>
                );
            case OmborType.KLEY:
                return (
                    <>
                        {renderCommonCells()}
                        <TableCell sx={cellSx}>{row.product_type || '-'}</TableCell>
                        <TableCell sx={cellSx}>{row.number_identifier || '-'}</TableCell>
                    </>
                );
            case OmborType.TAYYOR_TOSHKENT:
            case OmborType.TAYYOR_ANGREN:
                return (
                    <>
                        {renderCommonCells()}
                        <TableCell sx={cellSx}>{row.product_type || '-'}</TableCell>
                        <TableCell sx={cellSx}>{row.number_identifier || '-'}</TableCell>
                    </>
                );
            default:
                return renderCommonCells();
        }
    };

    return (
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
                <Table size="medium" sx={{ minWidth: tableMinWidth }}>
                    <TableHeadCustom headCells={TABLE_HEAD} />

                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableSkeleton key={index} />
                            ))
                        ) : (
                            items.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                        {fDate(row.date)}
                                    </TableCell>

                                    <TableCell sx={{ minWidth: 200, whiteSpace: 'nowrap' }}>
                                        <Box sx={{ fontWeight: 500 }}>{row.name}</Box>
                                    </TableCell>

                                    {renderExtraCells(row)}

                                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                        {getQuantityDisplay(row)}
                                    </TableCell>

                                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                        {getPriceDisplay(row)}
                                    </TableCell>

                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                        {row.description || '-'}
                                    </TableCell>

                                    <TableCell
                                        align="right"
                                        sx={{
                                            position: 'sticky',
                                            right: 0,
                                            backgroundColor: 'background.paper',
                                            boxShadow: (theme) => `-10px 0 20px -10px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.1)'}`,
                                            borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
                                        }}
                                    >
                                        <IconButton onClick={() => onTransactions(row.id)}>
                                            <Iconify icon="solar:transfer-horizontal-bold-duotone" />
                                        </IconButton>

                                        <IconButton onClick={() => onHistory(row.id)}>
                                            <Iconify icon="solar:clock-circle-bold" />
                                        </IconButton>

                                        <IconButton onClick={() => onEdit(row.id)}>
                                            <Iconify icon="solar:pen-bold" />
                                        </IconButton>

                                        <IconButton color="error" onClick={() => onDelete(row.id)}>
                                            <Iconify icon="solar:trash-bin-trash-bold" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}

                        <TableNoData notFound={!loading && items.length === 0} />
                    </TableBody>
                </Table>
            </Scrollbar>
        </TableContainer>
    );
}
