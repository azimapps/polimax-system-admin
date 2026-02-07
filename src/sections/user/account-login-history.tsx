import type { LoginHistory } from 'src/types/account';

import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { accountApi } from 'src/api/account';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function AccountLoginHistory() {
  const { t } = useTranslate();
  const { user } = useAuthContext();

  const [history, setHistory] = useState<LoginHistory[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const getHistory = useCallback(async () => {
    if (user?.id) {
      try {
        const offset = page * rowsPerPage;
        const data = await accountApi.getLoginHistory(Number(user.id), {
          limit: rowsPerPage,
          offset,
        });
        // Ensure data is an array before setting it
        setHistory(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setHistory([]);
      }
    }
  }, [user, page, rowsPerPage]);

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card>
      <Typography variant="h6" sx={{ p: 3 }}>
        {t('login_history')}
      </Typography>

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>{t('date')}</TableCell>
                <TableCell>{t('device')}</TableCell>
                <TableCell>{t('ip_address')}</TableCell>
                <TableCell>{t('country')}</TableCell>
                <TableCell>{t('status')}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {history.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{fDateTime(row.logged_in_at)}</TableCell>
                  <TableCell>
                    {row.device} - {row.browser} ({row.os})
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {row.city}
                    </Typography>
                  </TableCell>
                  <TableCell>{row.ip_address}</TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>
                    <Label color={row.success ? 'success' : 'error'}>
                      {row.success ? 'Success' : 'Failed'}
                    </Label>
                  </TableCell>
                </TableRow>
              ))}
              {history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" sx={{ py: 3 }}>
                      No Data
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={-1} // Unknown total count
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={({ from, to }) => `${from}–${to}`}
      />
    </Card>
  );
}
