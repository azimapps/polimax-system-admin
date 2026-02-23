
import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useRouter, usePathname } from 'src/routes/hooks';

import { useGetOmborItems, useDeleteOmborItem } from 'src/hooks/use-ombor';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { useAuthContext } from 'src/auth/hooks';

import { OmborType } from 'src/types/ombor';

import { OmborTable } from '../ombor-table';
import { OmborDialog } from '../ombor-dialog';
import { OmborHistoryDialog } from '../ombor-history-dialog';
import { OmborTransactionsDialog } from '../ombor-transactions-dialog';



// ----------------------------------------------------------------------

const PATH_MAP: Record<string, OmborType> = {
    '/ombor/plyonka': OmborType.PLYONKA,
    '/ombor/kraska': OmborType.KRASKA,
    '/ombor/suyuq-kraska': OmborType.SUYUQ_KRASKA,
    '/ombor/rastvaritel': OmborType.RASTVARITEL,
    '/ombor/rastvaritel-mix': OmborType.ARALASHMASI,
    '/ombor/cilindr': OmborType.SILINDIR,
    '/ombor/kley': OmborType.KLEY,
    '/ombor/zapchastlar': OmborType.ZAPCHASTLAR,
    '/ombor/otxod': OmborType.OTXOT,
    '/ombor/finished-products-toshkent': OmborType.TAYYOR_TOSHKENT,
    '/ombor/finished-products-angren': OmborType.TAYYOR_ANGREN,
};

const TYPE_TO_PATH: Record<string, string> = Object.fromEntries(
    Object.entries(PATH_MAP).map(([path, type]) => [type, path])
);

export function OmborListView() {
    const { t } = useTranslate('ombor');
    const router = useRouter();
    const pathname = usePathname();

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const { user } = useAuthContext();
    const isAdmin = ['admin', 'ceo', 'manager', 'ombor'].includes(user?.role || '');

    const allowedTabs = Object.values(OmborType).filter(tab => {
        if (isAdmin) return true;
        if (tab === OmborType.PLYONKA && user?.role === 'ombor_plyonka') return true;
        if (tab === OmborType.KRASKA && user?.role === 'ombor_kraska') return true;
        if (tab === OmborType.SUYUQ_KRASKA && user?.role === 'ombor_suyuq_kraska') return true;
        if (tab === OmborType.RASTVARITEL && user?.role === 'ombor_rastvaritel') return true;
        if (tab === OmborType.ARALASHMASI && user?.role === 'ombor_rastvaritel_aralashma') return true;
        if (tab === OmborType.KLEY && user?.role === 'ombor_kley') return true;
        if (tab === OmborType.SILINDIR && user?.role === 'ombor_silindr') return true;
        if (tab === OmborType.ZAPCHASTLAR && user?.role === 'ombor_zapchast') return true;
        if (tab === OmborType.TAYYOR_TOSHKENT && user?.role === 'ombor_tayyor_mahsulotlar_toshkent') return true;
        if (tab === OmborType.TAYYOR_ANGREN && user?.role === 'ombor_tayyor_mahsulotlar_angren') return true;
        return false;
    });

    const requestedTab = PATH_MAP[pathname] || OmborType.PLYONKA;
    const currentTab = allowedTabs.includes(requestedTab) ? requestedTab : (allowedTabs[0] || OmborType.PLYONKA);

    const { data: items = [], isLoading } = useGetOmborItems({
        ombor_type: currentTab,
        q: debouncedQuery,
    });
    const { mutateAsync: deleteItem } = useDeleteOmborItem(currentTab);

    const dialog = useBoolean();
    const historyDialog = useBoolean();
    const transactionsDialog = useBoolean();
    const confirmDialog = useBoolean();
    const [selectedId, setSelectedId] = useState<number | undefined>();
    const [historyId, setHistoryId] = useState<number | undefined>();
    const [transactionsId, setTransactionsId] = useState<number | undefined>();
    const [deleteId, setDeleteId] = useState<number | undefined>();

    const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        const timer = setTimeout(() => {
            setDebouncedQuery(event.target.value);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: OmborType) => {
        const path = TYPE_TO_PATH[newValue];
        if (path) {
            router.push(path);
        }
    }, [router]);


    const handleCreate = useCallback(() => {
        setSelectedId(undefined);
        dialog.onTrue();
    }, [dialog]);

    const handleEdit = useCallback(
        (id: number) => {
            setSelectedId(id);
            dialog.onTrue();
        },
        [dialog]
    );

    const handleHistoryClick = useCallback(
        (id: number) => {
            setHistoryId(id);
            historyDialog.onTrue();
        },
        [historyDialog]
    );

    const handleTransactionsClick = useCallback(
        (id: number) => {
            setTransactionsId(id);
            transactionsDialog.onTrue();
        },
        [transactionsDialog]
    );

    const handleDeleteClick = useCallback(
        (id: number) => {
            setDeleteId(id);
            confirmDialog.onTrue();
        },
        [confirmDialog]
    );

    const handleConfirmDelete = useCallback(async () => {
        if (deleteId) {
            await deleteItem(deleteId);
            confirmDialog.onFalse();
            setDeleteId(undefined);
        }
    }, [deleteId, deleteItem, confirmDialog]);

    return (
        <Container maxWidth="xl">
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
                <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>{t(`form.types.${currentTab}`)}</Typography>

                <Button
                    variant="contained"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={handleCreate}
                >
                    {t('new_item')}
                </Button>
            </Stack>

            <Card>
                <Tabs
                    value={currentTab}
                    onChange={handleChangeTab}
                    sx={{
                        px: 2.5,
                        boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.vars.palette.divider}`,
                    }}
                >
                    {allowedTabs.map((tab) => (
                        <Tab
                            key={tab}
                            iconPosition="end"
                            value={tab}
                            label={t(`form.types.${tab}`)}
                        />
                    ))}
                </Tabs>

                <Box sx={{ p: 2 }}>
                    <TextField
                        sx={{ maxWidth: 320 }}
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder={t('search_placeholder') || 'Qidirish...'}
                        InputProps={{
                            startAdornment: (
                                <Box component="span" sx={{ color: 'text.disabled', mr: 1, display: 'flex' }}>
                                    <Iconify icon="eva:search-fill" />
                                </Box>
                            ),
                        }}
                    />
                </Box>

                <OmborTable
                    type={currentTab}
                    items={items}
                    loading={isLoading}
                    onHistory={handleHistoryClick}
                    onTransactions={handleTransactionsClick}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            </Card>

            <OmborDialog
                open={dialog.value}
                onClose={dialog.onFalse}
                id={selectedId}
                type={currentTab}
            />

            <OmborHistoryDialog
                open={historyDialog.value}
                onClose={historyDialog.onFalse}
                id={historyId}
                type={currentTab}
            />

            <OmborTransactionsDialog
                open={transactionsDialog.value}
                onClose={transactionsDialog.onFalse}
                id={transactionsId}
                type={currentTab}
            />

            <ConfirmDialog
                open={confirmDialog.value}
                onClose={confirmDialog.onFalse}
                title={t('delete_confirm_title') || 'O\'chirishni tasdiqlaysizmi?'}
                content={t('delete_confirm_message') || 'Ushbu elementni o\'chirishni istaysizmi?'}
                action={
                    <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                        {t('delete') || 'O\'chirish'}
                    </Button>
                }
            />
        </Container>
    );
}

