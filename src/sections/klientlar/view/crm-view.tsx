import { useState, useCallback } from 'react';
import { useDebounce } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetLeads, useDeleteLead } from 'src/hooks/use-leads';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { LeadTable } from '../lead-table';
import { LeadDialog } from '../lead-dialog';
import { LeadHistoryDialog } from '../lead-history-dialog';
import { LeadConversationDialog } from '../lead-conversation-dialog';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'yangi', label: 'Yangi' },
    { value: 'qiziqishi_bor', label: 'Qiziqishi bor' },
    { value: 'juda_qiziqdi', label: 'Juda qiziqdi' },
    { value: 'rad_etildi', label: 'Rad etildi' },
    { value: 'mijozga_aylandi', label: 'Mijozga aylandi' },
];

export type LeadDialogType = 'edit' | 'delete' | 'history' | 'conversations' | null;

export function CRMView() {
    const { t } = useTranslate('lead');
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedQuery = useDebounce(searchQuery, 500);
    const [status, setStatus] = useState('all');

    const [selectedDialog, setSelectedDialog] = useState<{
        type: LeadDialogType;
        id: number | undefined;
    }>({ type: null, id: undefined });

    const handleOpen = useCallback((type: LeadDialogType, id?: number) => {
        setSelectedDialog({ type, id });
    }, []);

    const handleClose = useCallback(() => {
        setSelectedDialog({ type: null, id: undefined });
    }, []);

    const { data: leads = [], isLoading } = useGetLeads({
        q: debouncedQuery,
        status: status === 'all' ? undefined : status,
    });
    const { mutateAsync: deleteLead } = useDeleteLead();

    const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }, []);

    const handleFilterStatus = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setStatus(event.target.value);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (selectedDialog.id) {
            await deleteLead(selectedDialog.id);
            handleClose();
        }
    }, [selectedDialog.id, deleteLead, handleClose]);

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
                            onClick={() => handleOpen('edit')}
                        >
                            {t('new_lead')}
                        </Button>
                    </Stack>
                }
                sx={{ mb: 3 }}
            />

            <Card>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{ p: 2, alignItems: 'center' }}
                >
                    <TextField
                        fullWidth
                        sx={{ maxWidth: { sm: 320 } }}
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

                    <TextField
                        select
                        fullWidth
                        label={t('form.status')}
                        value={status}
                        onChange={handleFilterStatus}
                        sx={{ maxWidth: { sm: 200 } }}
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.value === 'all' ? t('status.all') : t(`status.${option.value}`)}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>

                <LeadTable
                    leads={leads}
                    loading={isLoading}
                    onOpen={handleOpen}
                />
            </Card>

            <LeadDialog
                open={selectedDialog.type === 'edit'}
                onClose={handleClose}
                id={selectedDialog.id}
            />

            <ConfirmDialog
                open={selectedDialog.type === 'delete'}
                onClose={handleClose}
                title={t('delete_confirm_title')}
                content={t('delete_confirm_message')}
                action={
                    <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                        {t('delete_confirm_button')}
                    </Button>
                }
            />

            <LeadHistoryDialog
                open={selectedDialog.type === 'history'}
                onClose={handleClose}
                leadId={selectedDialog.id ?? 0}
            />

            <LeadConversationDialog
                open={selectedDialog.type === 'conversations'}
                onClose={handleClose}
                leadId={selectedDialog.id ?? 0}
            />
        </Container>
    );
}
