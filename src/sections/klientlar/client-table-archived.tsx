import type { GridColDef } from '@mui/x-data-grid';
import type { ArchivedClientListItem } from 'src/types/client';

import { memo, useMemo } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  clients: ArchivedClientListItem[];
  loading: boolean;
  onRestore: (id: number) => void;
};

function KlientlarTableArchivedComponent({ clients, loading, onRestore }: Props) {
  const { t } = useTranslate('client');
  const columns: GridColDef<ArchivedClientListItem>[] = useMemo(
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
        field: 'company',
        headerName: t('table.company'),
        flex: 1,
        minWidth: 200,
        sortable: false,
      },
      {
        field: 'actions',
        headerName: t('table.actions'),
        width: 100,
        sortable: false,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params) => (
          <Box display="flex" justifyContent="flex-end" width="100%">
            <IconButton
              color="success"
              onClick={(event) => {
                event.stopPropagation();
                onRestore(params.row.id);
              }}
            >
              <Iconify icon="solar:restart-bold" />
            </IconButton>
          </Box>
        ),
      },
    ],
    [onRestore, t]
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
        height: clients.length > 0 ? 'auto' : 400,
      }}
    />
  );
}

export const KlientlarTableArchived = memo(KlientlarTableArchivedComponent);
