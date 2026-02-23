import type { OmborItem } from 'src/types/ombor';

import { useMemo, useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useGetClients } from 'src/hooks/use-clients';
import { useGetOmborItems } from 'src/hooks/use-ombor';
import { useGetPartners } from 'src/hooks/use-partners';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

import { AnalyticsCurrentVisits } from 'src/module/overview/analytics/analytics-current-visits';
import { AnalyticsWidgetSummary } from 'src/module/overview/analytics/analytics-widget-summary';

import { useAuthContext } from 'src/auth/hooks';

import { OmborType } from 'src/types/ombor';

import { OmborOverallAnalytics } from './ombor-overall-analytics';

// ----------------------------------------------------------------------

export function OmborAnalyticsView() {
    const { t } = useTranslate('ombor');
    const theme = useTheme();
    const { user } = useAuthContext();

    const [currentTab, setCurrentTab] = useState<OmborType | 'overall'>('overall');

    const { data: items = [] } = useGetOmborItems({
        ombor_type: currentTab as OmborType,
    });

    const { data: clients = [] } = useGetClients();
    const { data: partners = [] } = useGetPartners();

    const TAB_OPTIONS = useMemo(
        () => [
            { value: 'overall', label: t('analytics.overall') },
            { value: OmborType.PLYONKA, label: t('form.types.plyonka') },
            { value: OmborType.KRASKA, label: t('form.types.kraska') },
            { value: OmborType.SUYUQ_KRASKA, label: t('form.types.suyuq_kraska') },
            { value: OmborType.RASTVARITEL, label: t('form.types.rastvaritel') },
            { value: OmborType.ARALASHMASI, label: t('form.types.aralashmasi') },
            { value: OmborType.SILINDIR, label: t('form.types.silindr') },
            { value: OmborType.KLEY, label: t('form.types.kley') },
            { value: OmborType.ZAPCHASTLAR, label: t('form.types.zapchastlar') },
            { value: OmborType.OTXOT, label: t('form.types.otxot') },
            { value: OmborType.TAYYOR_TOSHKENT, label: t('form.types.tayyor_toshkent') },
            { value: OmborType.TAYYOR_ANGREN, label: t('form.types.tayyor_angren') },
        ].filter((tab) => {
            if (user?.role?.name === 'staff' && user?.staff_type === 'tayyor_mahsulot') {
                if (user?.staff_region === 'toshkent' && tab.value === OmborType.TAYYOR_ANGREN) return false;
                if (user?.staff_region === 'angren' && tab.value === OmborType.TAYYOR_TOSHKENT) return false;
            }
            return true;
        }),
        [t, user]
    );

    const handleChangeTab = (event: React.SyntheticEvent, newValue: OmborType | 'overall') => {
        setCurrentTab(newValue);
    };

    const OMBOR_TABS = useMemo(() => TAB_OPTIONS.filter(tab => tab.value !== 'overall') as { value: OmborType; label: string }[], [TAB_OPTIONS]);

    const metrics = useMemo(() => {
        let totalQty = 0;
        let totalValue = 0;
        const categoryMap: Record<string, number> = {};
        const clientMap: Record<string, number> = {};

        items.forEach((item: OmborItem) => {
            let price = item.price || 0;
            if (!price) {
                if (item.price_per_kg && item.total_kg) {
                    price = item.price_per_kg * item.total_kg;
                } else if (item.price_per_liter && item.total_liter) {
                    price = item.price_per_liter * item.total_liter;
                }
            }
            totalValue += price;

            let qty = 0;
            if ([OmborType.PLYONKA, OmborType.KRASKA, OmborType.SUYUQ_KRASKA, OmborType.OTXOT].includes(currentTab as OmborType)) {
                qty = item.total_kg || 0;
            } else if ([OmborType.RASTVARITEL, OmborType.ARALASHMASI].includes(currentTab as OmborType)) {
                qty = item.total_liter || 0;
            } else {
                qty = item.quantity || item.barrels || 0;
            }
            totalQty += qty;

            const cat = item.plyonka_category || item.color_name || item.solvent_type || item.product_type || t('analytics.other');
            categoryMap[cat] = (categoryMap[cat] || 0) + qty;

            let sourceName = t('analytics.internal');
            if (item.supplier_id) {
                const partner = partners.find(p => p.id === item.supplier_id);
                sourceName = partner ? partner.fullname : `${t('analytics.supplier')} #${item.supplier_id}`;
            } else if (item.client_id) {
                const client = clients.find(c => c.id === item.client_id);
                sourceName = client ? client.fullname : `${t('analytics.client')} #${item.client_id}`;
            }
            clientMap[sourceName] = (clientMap[sourceName] || 0) + 1;
        });

        const categoryData = Object.entries(categoryMap).map(([label, value]) => ({ label: label.toUpperCase(), value }));
        const clientData = Object.entries(clientMap).map(([label, value]) => ({ label, value }));

        return {
            totalItems: items.length,
            totalQty,
            totalValue,
            categoryData,
            clientData
        };
    }, [items, currentTab, t, partners, clients]);

    return (
        <Container maxWidth="xl">
            <Box mb={5}>
                <Typography variant="h4">{t('ombor_analytics')}</Typography>
            </Box>

            <Card sx={{ mb: 5 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleChangeTab}
                    sx={{
                        px: 2.5,
                        boxShadow: (theming) => `inset 0 -2px 0 0 ${theming.palette.background.neutral}`,
                    }}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {TAB_OPTIONS.map((tab) => (
                        <Tab key={tab.value} value={tab.value} label={tab.label} />
                    ))}
                </Tabs>
            </Card>

            {currentTab === 'overall' ? (
                <OmborOverallAnalytics tabs={OMBOR_TABS} />
            ) : (
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <AnalyticsWidgetSummary
                            title={t('analytics.total_items')}
                            percent={0}
                            total={metrics.totalItems}
                            icon={<Iconify icon="solar:inbox-in-bold-duotone" width={32} />}
                            chart={{
                                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
                                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <AnalyticsWidgetSummary
                            title={t('analytics.total_volume')}
                            percent={0}
                            total={metrics.totalQty}
                            color="warning"
                            icon={<Iconify icon="solar:settings-bold-duotone" width={32} />}
                            chart={{
                                series: [20, 18, 12, 51, 68, 11, 39, 37, 27, 20],
                                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <AnalyticsWidgetSummary
                            title={t('analytics.est_total_value')}
                            percent={0}
                            total={metrics.totalValue}
                            formatter={(value: number) =>
                                new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                }).format(value || 0)
                            }
                            color="success"
                            icon={<Iconify icon="solar:bill-list-bold-duotone" width={32} />}
                            chart={{
                                series: [2, 18, 12, 51, 68, 11, 39, 37, 27, 20],
                                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                            }}
                        />
                    </Grid>

                    {metrics.categoryData.length > 0 && (
                        <Grid size={{ xs: 12, md: 6 }}>
                            <AnalyticsCurrentVisits
                                title={t('analytics.volume_by_category')}
                                chart={{
                                    series: metrics.categoryData,
                                    colors: [
                                        theme.palette.primary.main,
                                        theme.palette.warning.main,
                                        theme.palette.info.main,
                                        theme.palette.error.main,
                                        theme.palette.success.main,
                                    ],
                                }}
                            />
                        </Grid>
                    )}

                    {metrics.clientData.length > 0 && (
                        <Grid size={{ xs: 12, md: 6 }}>
                            <AnalyticsCurrentVisits
                                title={t('analytics.items_by_source')}
                                chart={{
                                    series: metrics.clientData,
                                    colors: [
                                        theme.palette.success.light,
                                        theme.palette.secondary.main,
                                        theme.palette.primary.light,
                                        theme.palette.warning.light,
                                    ],
                                }}
                            />
                        </Grid>
                    )}
                </Grid>
            )}
        </Container>
    );
}
