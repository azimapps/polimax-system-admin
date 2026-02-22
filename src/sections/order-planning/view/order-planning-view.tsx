import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';

import { useGetPlanItems, useDeletePlanItem } from 'src/hooks/use-plan-items';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PlanItemStatus } from 'src/types/plan-item';

import { OrderPlanningTable } from '../order-planning-table';
import { OrderPlanningDialog } from '../order-planning-dialog';
import { OrderPlanningDetailDialog } from '../order-planning-detail-dialog';

// ----------------------------------------------------------------------

export function OrderPlanningView() {
    const { t } = useTranslate('order-planning');
    const pathname = usePathname();

    const currentStatus = useMemo(() => {
        if (pathname.includes('/order-planning/finished')) return PlanItemStatus.FINISHED;
        return PlanItemStatus.IN_PROGRESS;
    }, [pathname]);

    const title = useMemo(() => currentStatus === PlanItemStatus.FINISHED ? t('finished') : t('in_progress'), [currentStatus, t]);

    const { data: planItems = [], isLoading } = useGetPlanItems({ status: currentStatus });
    const { mutateAsync: deletePlanItem } = useDeletePlanItem();

    const dialog = useBoolean();
    const detailDialog = useBoolean();
    const confirmDialog = useBoolean();

    const [selectedId, setSelectedId] = useState<number | undefined>();
    const [deleteId, setDeleteId] = useState<number | undefined>();

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

    const handleView = useCallback(
        (id: number) => {
            setSelectedId(id);
            detailDialog.onTrue();
        },
        [detailDialog]
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
            await deletePlanItem(deleteId);
            confirmDialog.onFalse();
            setDeleteId(undefined);
        }
    }, [deleteId, deletePlanItem, confirmDialog]);

    return (
        <Container maxWidth="xl">
            <CustomBreadcrumbs
                heading={title}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: t('title'), href: paths.dashboard.orderPlanning.root },
                    { name: title }
                ]}
                action={
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            onClick={handleCreate}
                        >
                            {t('new_plan')}
                        </Button>
                    </Stack>
                }
                sx={{ mb: 3 }}
            />

            <Card>
                <OrderPlanningTable
                    planItems={planItems}
                    loading={isLoading}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            </Card>

            <OrderPlanningDialog
                open={dialog.value}
                onClose={dialog.onFalse}
                id={selectedId}
            />

            <OrderPlanningDetailDialog
                open={detailDialog.value}
                onClose={detailDialog.onFalse}
                id={selectedId}
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
