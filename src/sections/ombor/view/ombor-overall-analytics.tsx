import type { OmborItem } from 'src/types/ombor';

import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { fShortenNumber } from 'src/utils/format-number';

import { omborApi } from 'src/api/ombor-api';

import { Scrollbar } from 'src/components/scrollbar';

import { OmborType } from 'src/types/ombor';

// ----------------------------------------------------------------------

type Props = {
    tabs: { value: OmborType; label: string }[];
};

export function OmborOverallAnalytics({ tabs }: Props) {
    const queries = useQueries({
        queries: tabs.map((tab) => ({
            queryKey: ['ombor', tab.value],
            queryFn: () => omborApi.getOmborItems(tab.value),
        })),
    });

    const rows = useMemo(() => queries.map((query, index) => {
        const items = (query.data || []) as OmborItem[];
        const tab = tabs[index];

        let totalQty = 0;
        const totalValues: Record<string, number> = {};
        let unit = 'unit';

        if ([OmborType.PLYONKA, OmborType.KRASKA, OmborType.SUYUQ_KRASKA, OmborType.OTXOT].includes(tab.value)) {
            unit = 'kg';
        } else if ([OmborType.RASTVARITEL, OmborType.ARALASHMASI].includes(tab.value)) {
            unit = 'L';
        } else if ([OmborType.SILINDIR, OmborType.KLEY, OmborType.TAYYOR_TOSHKENT, OmborType.TAYYOR_ANGREN, OmborType.ZAPCHASTLAR].includes(tab.value)) {
            unit = 'unit';
        }

        items.forEach((item) => {
            let qty = 0;
            if ([OmborType.PLYONKA, OmborType.KRASKA, OmborType.SUYUQ_KRASKA, OmborType.OTXOT].includes(tab.value)) {
                qty = item.total_kg || 0;
            } else if ([OmborType.RASTVARITEL, OmborType.ARALASHMASI].includes(tab.value)) {
                qty = item.total_liter || 0;
            } else {
                qty = item.quantity || item.barrels || 0;
            }
            totalQty += qty;

            let price = item.price || 0;
            if (!price) {
                if (item.price_per_kg && item.total_kg) {
                    price = item.price_per_kg * item.total_kg;
                } else if (item.price_per_liter && item.total_liter) {
                    price = item.price_per_liter * item.total_liter;
                }
            }

            if (price) {
                totalValues.usd = (totalValues.usd || 0) + price;
            } else {
                totalValues.usd = totalValues.usd || 0;
            }
        });

        return {
            id: tab.value,
            label: tab.label,
            totalQty,
            unit,
            totalValues,
            count: items.length,
        };
    }), [queries, tabs]);

    return (
        <Card sx={{ mb: 5 }}>
            <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                        <TableBody>
                            {rows.map((row) => {
                                const renderTotals = () => {
                                    const formatted = new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2,
                                    }).format(row.totalValues.usd || 0);

                                    return (
                                        <Typography variant="body2" component="span" sx={{ whiteSpace: 'nowrap' }}>
                                            {formatted}
                                        </Typography>
                                    );
                                };
                                return (
                                    <TableRow key={row.id}>
                                        <TableCell sx={{ typography: 'subtitle2' }}>{row.label}</TableCell>
                                        <TableCell>{fShortenNumber(row.totalQty)}</TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>{row.unit}</TableCell>
                                        <TableCell>{renderTotals()}</TableCell>
                                        <TableCell align="right">{row.count}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Scrollbar>
        </Card>
    );
}
