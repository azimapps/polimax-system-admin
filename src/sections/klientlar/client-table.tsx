import type { GridColDef } from '@mui/x-data-grid';
import type { ClientListItem } from 'src/types/client';

import { memo, useMemo } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';

import { fCurrency } from 'src/utils/format-number';
import { fPhoneNumber } from 'src/utils/format-phone';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  clients: ClientListItem[];
  loading: boolean;
  onHistory: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onTransactions: (id: number) => void;
};

function KlientlarTableComponent({ clients, loading, onHistory, onEdit, onDelete, onTransactions }: Props) {
  const { t } = useTranslate('client');
  const columns: GridColDef<ClientListItem>[] = useMemo(
    () => [
      {
        field: 'profile_url',
        headerName: t('table.profile_image'),
        width: 80,
        sortable: false,
        renderCell: (params) => (
          <Box alignItems="center" display="flex" justifyContent="center">
            <Avatar
              alt={params.row.fullname}
              src={params.row.profile_url || undefined}
              sx={{ height: 40, width: 40 }}
            >
              {params.row.fullname?.charAt(0)?.toUpperCase()}
            </Avatar>
          </Box>
        ),
      },
      {
        field: 'fullname',
        headerName: t('table.fullname'),
        flex: 1,
        minWidth: 200,
        sortable: false,
      },
      {
        field: 'phone_number',
        headerName: t('table.phone_number'),
        width: 150,
        sortable: false,
        renderCell: (params) => fPhoneNumber(params.row.phone_number),
      },
      {
        field: 'transactions_total',
        headerName: t('table.transactions_total'),
        width: 150,
        sortable: false,
        renderCell: (params) => fCurrency(params.row.transactions_total),
      },
      {
        field: 'company',
        headerName: t('table.company'),
        flex: 1,
        minWidth: 200,
        sortable: false,
        valueGetter: (params) => params || '-',
      },
      {
        field: 'actions',
        headerName: t('table.actions'),
        width: 180,
        sortable: false,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params) => (
          <Box display="flex" justifyContent="flex-end" width="100%">
            <Tooltip title={t('transaction.transactions')} arrow>
              <IconButton
                color="success"
                onMouseDown={(event) => {
                  event.stopPropagation();
                  onTransactions(params.row.id);
                }}
              >
                <Iconify icon="solar:wad-of-money-bold" sx={{ pointerEvents: 'none' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title={t('history_button')} arrow>
              <IconButton
                onMouseDown={(event) => {
                  event.stopPropagation();
                  onHistory(params.row.id);
                }}
              >
                <Iconify icon="solar:clock-circle-bold" sx={{ pointerEvents: 'none' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title={t('update')} arrow>
              <IconButton
                onMouseDown={(event) => {
                  event.stopPropagation();
                  onEdit(params.row.id);
                }}
              >
                <Iconify icon="solar:pen-bold" sx={{ pointerEvents: 'none' }} />
              </IconButton>
            </Tooltip>

            <Tooltip title={t('delete_confirm_button')} arrow>
              <IconButton
                color="error"
                onMouseDown={(event) => {
                  event.stopPropagation();
                  onDelete(params.row.id);
                }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" sx={{ pointerEvents: 'none' }} />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [onEdit, onDelete, onHistory, onTransactions, t]
  );

  return (
    <DataGrid
      columns={columns}
      disableColumnMenu
      disableRowSelectionOnClick
      loading={loading}
      rows={clients}
      pageSizeOptions={[5, 10, 25]}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 10 },
        },
      }}
      sx={{
        '& .MuiDataGrid-cell:focus': {
          outline: 'none',
        },
        '& .MuiDataGrid-cell:focus-within': {
          outline: 'none',
        },
        height: clients.length > 0 ? 'auto' : 400,
      }}
    />
  );
}

export const KlientlarTable = memo(KlientlarTableComponent);
