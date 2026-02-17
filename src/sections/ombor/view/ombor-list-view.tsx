
import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { useGetOmborItems, useDeleteOmborItem } from 'src/hooks/use-ombor';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { OmborTable } from '../ombor-table';
import { OmborDialog } from '../ombor-dialog';

// ----------------------------------------------------------------------

export function OmborListView() {
    const { t } = useTranslate('ombor');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const { data: items = [], isLoading } = useGetOmborItems({ q: debouncedQuery });
    const { mutateAsync: deleteItem } = useDeleteOmborItem();

    const dialog = useBoolean();
    const confirmDialog = useBoolean();
    const [selectedId, setSelectedId] = useState<number | undefined>();
    const [deleteId, setDeleteId] = useState<number | undefined>();

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
            await deleteItem(deleteId);
            confirmDialog.onFalse();
            setDeleteId(undefined);
        }
    }, [deleteId, deleteItem, confirmDialog]);

    return (
        <Container maxWidth="xl">
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
                <Typography variant="h4">{t('list_title')}</Typography>

                <Button
                    variant="contained"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={handleCreate}
                >
                    {t('new_item')}
                </Button>
            </Stack>

            <Card>
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
                    items={items}
                    loading={isLoading}
                    onHistory={(id) => console.log('History for', id)}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                />
            </Card>

            <OmborDialog
                open={dialog.value}
                onClose={dialog.onFalse}
                id={selectedId}
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
