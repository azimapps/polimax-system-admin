
import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetOrder, useGetOrders, useDeleteOrder } from 'src/hooks/use-orders';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { OrderTable } from '../order-table';
import { OrderBookDialog } from '../order-dialog';
import { OrderHistoryDialog } from '../order-history-dialog';

// ----------------------------------------------------------------------

export function OrdersView() {
    const { t } = useTranslate('order');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const { data: orders = [], isLoading } = useGetOrders({ q: debouncedQuery });
    const { mutateAsync: deleteOrder } = useDeleteOrder();

    const dialog = useBoolean();
    const confirmDialog = useBoolean();
    const historyDialog = useBoolean();

    const [selectedId, setSelectedId] = useState<number | undefined>();
    const [deleteId, setDeleteId] = useState<number | undefined>();
    const [historyOrderId, setHistoryOrderId] = useState<number>(0);

    const { data: selectedOrder } = useGetOrder(selectedId || 0);

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
            await deleteOrder(deleteId);
            confirmDialog.onFalse();
            setDeleteId(undefined);
        }
    }, [deleteId, deleteOrder, confirmDialog]);

    const handleHistory = useCallback(
        (id: number) => {
            setHistoryOrderId(id);
            historyDialog.onTrue();
        },
        [historyDialog]
    );

    return (
        <Container maxWidth="xl">
            <CustomBreadcrumbs
                heading={t('list_title')}
                links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: t('list_title') }]}
                action={
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            onClick={handleCreate}
                        >
                            {t('new_item')}
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
                        placeholder="Search orders..."
                        InputProps={{
                            startAdornment: (
                                <Box component="span" sx={{ color: 'text.disabled', mr: 1, display: 'flex' }}>
                                    <Iconify icon="eva:search-fill" />
                                </Box>
                            ),
                        }}
                    />
                </Container>

                <OrderTable
                    orders={orders}
                    loading={isLoading}
                    onHistory={handleHistory}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            </Card>

            <OrderBookDialog open={dialog.value} onClose={dialog.onFalse} order={selectedOrder} />

            <ConfirmDialog
                open={confirmDialog.value}
                onClose={confirmDialog.onFalse}
                title="Delete Order"
                content="Are you sure you want to delete this order?"
                action={
                    <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                }
            />

            <OrderHistoryDialog
                open={historyDialog.value}
                onClose={historyDialog.onFalse}
                orderId={historyOrderId}
            />
        </Container>
    );
}
