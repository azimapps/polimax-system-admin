
import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';

import { useGetStanoklar, useDeleteStanok } from 'src/hooks/use-stanok';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { StanokType } from 'src/types/stanok';

import { StanokTable } from '../stanok-table';
import { StanokDialog } from '../stanok-dialog';
import { StanokHistoryDialog } from '../stanok-history-dialog';

// ----------------------------------------------------------------------

export function StanokListView() {
    const { t } = useTranslate('stanok');
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const currentType = useMemo(() => {
        if (pathname.includes('/stanoklar/pechat')) return StanokType.PECHAT;
        if (pathname.includes('/stanoklar/reska')) return StanokType.RESKA;
        if (pathname.includes('/stanoklar/laminatsiya')) return StanokType.LAMINATSIYA;
        return undefined;
    }, [pathname]);

    const title = useMemo(() => {
        if (currentType) return t(`type.${currentType}`);
        return t('list_title');
    }, [currentType, t]);

    const { data: stanokList = [], isLoading } = useGetStanoklar(debouncedQuery, currentType);
    const { mutateAsync: deleteStanok } = useDeleteStanok();

    const dialog = useBoolean();
    const confirmDialog = useBoolean();
    const historyDialog = useBoolean();
    const [selectedId, setSelectedId] = useState<number | undefined>();
    const [deleteId, setDeleteId] = useState<number | undefined>();
    const [historyStanokId, setHistoryStanokId] = useState<number>(0);

    const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        const timer = setTimeout(() => {
            setDebouncedQuery(event.target.value);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleCreate = useCallback(() => {
        setSelectedId(undefined);
        dialog.onTrue();
    }, [dialog]);

    const handleHistory = useCallback(
        (id: number) => {
            setHistoryStanokId(id);
            historyDialog.onTrue();
        },
        [historyDialog]
    );

    const handleEdit = useCallback(
        (id: number) => {
            setSelectedId(id);
            dialog.onTrue();
        },
        [dialog]
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
            await deleteStanok(deleteId);
            confirmDialog.onFalse();
            setDeleteId(undefined);
        }
    }, [deleteId, deleteStanok, confirmDialog]);

    return (
        <Container maxWidth="xl">
            <CustomBreadcrumbs
                heading={title}
                links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: t('list_title'), href: paths.dashboard.stanoklar.list }, { name: title }]}
                action={
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            startIcon={<Iconify icon="solar:inbox-bold" />}
                            href={paths.dashboard.stanoklar.archived}
                        >
                            {t('archive')}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            onClick={handleCreate}
                        >
                            {t('new_stanok')}
                        </Button>
                    </Stack>
                }
                sx={{ mb: 3 }}
            />

            <Card>
                <Container sx={{ p: 2 }}>
                    <TextField
                        sx={{ maxWidth: 320 }}
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder={t('search_placeholder')}
                        InputProps={{
                            startAdornment: (
                                <Box component="span" sx={{ color: 'text.disabled', mr: 1, display: 'flex' }}>
                                    <Iconify icon="eva:search-fill" />
                                </Box>
                            ),
                        }}
                    />
                </Container>

                <StanokTable
                    stanokList={stanokList}
                    loading={isLoading}
                    onHistory={handleHistory}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            </Card>

            <StanokDialog
                open={dialog.value}
                onClose={dialog.onFalse}
                id={selectedId}
                defaultType={currentType}
            />

            <ConfirmDialog
                open={confirmDialog.value}
                onClose={confirmDialog.onFalse}
                title={t('delete_confirm_title')}
                content={t('delete_confirm_message')}
                action={
                    <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                        {t('delete_confirm_button')}
                    </Button>
                }
            />

            <StanokHistoryDialog
                open={historyDialog.value}
                onClose={historyDialog.onFalse}
                stanokId={historyStanokId}
            />
        </Container>
    );
}
