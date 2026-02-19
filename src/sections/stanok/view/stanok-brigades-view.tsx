
import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useGetStanok } from 'src/hooks/use-stanok';
import { useGetBrigada, useGetBrigadas, useDeleteBrigada } from 'src/hooks/use-brigadas';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BrigadaTable } from '../brigada-table';
import { BrigadaDialog } from '../brigada-dialog';
import { BrigadaMemberDialog } from '../brigada-member-dialog';
import { BrigadaHistoryDialog } from '../brigada-history-dialog';

// ----------------------------------------------------------------------

export function StanokBrigadesView() {
    const { t } = useTranslate('stanok');
    const params = useParams();
    const id = Number(params.id);

    const { data: stanok } = useGetStanok(id);
    const { data: brigadasData = [], isLoading } = useGetBrigadas({ machine_type: stanok?.type });
    const { mutateAsync: deleteBrigada } = useDeleteBrigada();

    // Filter brigadas for this specific machine_id on client side as well
    const filteredBrigadas = useMemo(() =>
        brigadasData.filter(b => b.machine_id === id),
        [brigadasData, id]);

    const brigadaDialog = useBoolean();
    const confirmDialog = useBoolean();
    const membersDialog = useBoolean();
    const historyDialog = useBoolean();

    const [selectedBrigadaId, setSelectedBrigadaId] = useState<number | undefined>();
    const [deleteBrigadaId, setDeleteBrigadaId] = useState<number | undefined>();

    const { data: selectedBrigada } = useGetBrigada(selectedBrigadaId || 0);

    const handleCreate = useCallback(() => {
        setSelectedBrigadaId(undefined);
        brigadaDialog.onTrue();
    }, [brigadaDialog]);

    const handleEdit = useCallback((brigadaId: number) => {
        setSelectedBrigadaId(brigadaId);
        brigadaDialog.onTrue();
    }, [brigadaDialog]);

    const handleDeleteClick = useCallback((brigadaId: number) => {
        setDeleteBrigadaId(brigadaId);
        confirmDialog.onTrue();
    }, [confirmDialog]);

    const handleConfirmDelete = useCallback(async () => {
        if (deleteBrigadaId) {
            await deleteBrigada(deleteBrigadaId);
            confirmDialog.onFalse();
            setDeleteBrigadaId(undefined);
        }
    }, [deleteBrigadaId, deleteBrigada, confirmDialog]);

    const handleMembers = useCallback((brigadaId: number) => {
        setSelectedBrigadaId(brigadaId);
        membersDialog.onTrue();
    }, [membersDialog]);

    const handleHistory = useCallback((brigadaId: number) => {
        setSelectedBrigadaId(brigadaId);
        historyDialog.onTrue();
    }, [historyDialog]);

    const selectedBrigadaName = useMemo(() => {
        const b = filteredBrigadas.find(item => item.id === selectedBrigadaId);
        return b?.name || '';
    }, [filteredBrigadas, selectedBrigadaId]);

    return (
        <Container maxWidth="xl">
            <CustomBreadcrumbs
                heading={`${t('actions_menu.brigades')} - ${stanok?.name || ''}`}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: t('list_title'), href: paths.dashboard.stanoklar.list },
                    { name: t('actions_menu.brigades') },
                ]}
                action={
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        onClick={handleCreate}
                    >
                        {t('brigada.new_item')}
                    </Button>
                }
                sx={{ mb: 3 }}
            />

            <Card>
                <BrigadaTable
                    brigadas={filteredBrigadas}
                    loading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onHistory={handleHistory}
                    onMembers={handleMembers}
                />
            </Card>

            <BrigadaDialog
                open={brigadaDialog.value}
                onClose={brigadaDialog.onFalse}
                brigada={selectedBrigada}
                machineId={id}
                machineType={stanok?.type as any}
            />

            <BrigadaMemberDialog
                open={membersDialog.value}
                onClose={membersDialog.onFalse}
                brigadaId={selectedBrigadaId || 0}
                brigadaName={selectedBrigadaName}
            />

            <BrigadaHistoryDialog
                open={historyDialog.value}
                onClose={historyDialog.onFalse}
                brigadaId={selectedBrigadaId || 0}
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
        </Container>
    );
}
