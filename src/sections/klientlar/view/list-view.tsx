import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetClients, useDeleteClient } from 'src/hooks/use-clients';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ClientDialog } from '../client-dialog';
import { KlientlarTable } from '../client-table';
import { ClientHistoryDialog } from '../client-history-dialog';

// ----------------------------------------------------------------------

export function KlientlarListView() {
  const { t } = useTranslate('client');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const { data: clients = [], isLoading } = useGetClients(debouncedQuery);
  const { mutateAsync: deleteClient } = useDeleteClient();

  const dialog = useBoolean();
  const confirmDialog = useBoolean();
  const historyDialog = useBoolean();
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const [deleteId, setDeleteId] = useState<number | undefined>();
  const [historyClientId, setHistoryClientId] = useState<number>(0);

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
      setHistoryClientId(id);
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
      await deleteClient(deleteId);
      confirmDialog.onFalse();
      setDeleteId(undefined);
    }
  }, [deleteId, deleteClient, confirmDialog]);

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('list_title')}
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: t('list_title') }]}
        action={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="solar:inbox-bold" />}
              href={paths.dashboard.klientlar.archived}
            >
              {t('archive')}
            </Button>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleCreate}
            >
              {t('new_client')}
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

        <KlientlarTable
          clients={clients}
          loading={isLoading}
          onHistory={handleHistory}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </Card>

      <ClientDialog open={dialog.value} onClose={dialog.onFalse} id={selectedId} />

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

      <ClientHistoryDialog
        open={historyDialog.value}
        onClose={historyDialog.onFalse}
        clientId={historyClientId}
      />
    </Container>
  );
}
