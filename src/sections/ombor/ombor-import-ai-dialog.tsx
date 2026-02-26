
import type { OmborType } from 'src/types/ombor';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';

import { useTranslate } from 'src/locales';
import { omborApi } from 'src/api/ombor-api';

import { Upload } from 'src/components/upload';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type ParseResult = {
    total_rows: number;
    valid_rows: number;
    items: any[];
    errors: { row: number; message: string }[];
};

type Props = {
    open: boolean;
    onClose: () => void;
    type: OmborType;
    onSuccess?: () => void;
};

export function OmborImportAiDialog({ open, onClose, type, onSuccess }: Props) {
    const { t } = useTranslate('ombor');

    const [file, setFile] = useState<File | null>(null);
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'saving' | 'complete'>('idle');
    const [result, setResult] = useState<ParseResult | null>(null);

    const handleDrop = useCallback((acceptedFiles: File[]) => {
        const newFile = acceptedFiles[0];
        if (newFile) {
            setFile(newFile);
        }
    }, []);

    const handleUpload = async () => {
        if (!file) return;

        setStatus('uploading');
        try {
            const res = await omborApi.parseSheet(type, file);
            setSessionId(res.session_id);
            setStatus(res.status); // backend now always returns 'complete'
            if (res.status === 'complete') {
                setResult(res.result);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.detail || error?.message || 'Upload failed');
            setStatus('idle');
        }
    };

    const handleImport = async () => {
        if (!sessionId) return;

        setStatus('saving');
        try {
            await omborApi.importParsedSheet(type, sessionId);
            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error(error?.response?.data?.detail || error?.message || 'Import failed');
            setStatus('complete');
        }
    }

    const handleDownload = () => {
        if (sessionId) {
            const url = omborApi.getParsedSheetDownloadUrl(type, sessionId);
            window.open(url, '_blank');
        }
    };

    const renderResult = () => (
        <Stack spacing={3} sx={{ py: 3 }}>
            <Box>
                <Alert severity="success" sx={{ mb: 2 }}>{t('import_ai.complete')}</Alert>
                {status === 'saving' && (
                    <Typography variant="caption" color="primary" sx={{ textAlign: 'center', display: 'block', animate: 'pulse 2s infinite' }}>
                        {t('import_ai.saving_progress') || 'Saving items to system... Please wait.'}
                    </Typography>
                )}
            </Box>

            <Stack direction="row" spacing={2}>
                <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1, flexGrow: 1 }}>
                    <Typography variant="overline">{t('import_ai.results.total_rows')}</Typography>
                    <Typography variant="h4">{result?.total_rows}</Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: 'success.lighter', color: 'success.darker', borderRadius: 1, flexGrow: 1 }}>
                    <Typography variant="overline">{t('import_ai.results.valid_rows')}</Typography>
                    <Typography variant="h4">{result?.valid_rows}</Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: 'error.lighter', color: 'error.darker', borderRadius: 1, flexGrow: 1 }}>
                    <Typography variant="overline">{t('import_ai.results.errors')}</Typography>
                    <Typography variant="h4">{result?.errors.length}</Typography>
                </Box>
            </Stack>

            <Scrollbar sx={{ maxHeight: 300 }}>
                <TableContainer>
                    <Table size="small">
                        <TableBody>
                            {result?.items.slice(0, 10).map((item, i) => {
                                const amount = item.total_kg || item.total_liter || item.quantity || item.net_weight || 0;
                                const unit = item.total_kg ? 'kg' : item.total_liter ? 'L' : item.quantity ? 'pcs' : '';
                                const subInfo = item.plyonka_category || item.color_name || item.marka || item.seriya_number || '';
                                const price = item.price_per_kg || item.price_per_liter || item.price || 0;

                                return (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <Typography variant="subtitle2" noWrap>{item.name}</Typography>
                                            {subInfo && <Typography variant="caption" color="text.secondary" noWrap>{subInfo}</Typography>}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" noWrap>{amount} {unit}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" color="primary.main" fontWeight="bold">
                                                ${price}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Scrollbar>

            <Stack direction="row" spacing={2}>
                <Button fullWidth variant="outlined" startIcon={<Iconify icon="solar:download-bold" />} onClick={handleDownload} disabled={status === 'saving'}>
                    {t('import_ai.download_parsed')}
                </Button>
                <LoadingButton fullWidth variant="contained" color="success" onClick={handleImport} loading={status === 'saving'}>
                    {t('import_ai.save_to_system')}
                </LoadingButton>
            </Stack>
        </Stack>
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="solar:pen-bold" width={24} sx={{ color: 'primary.main' }} />
                    <Typography variant="h6">{t('import_ai.title')}</Typography>
                </Stack>
            </DialogTitle>

            <DialogContent>
                {status === 'idle' && (
                    <Box sx={{ py: 3 }}>
                        <Upload
                            value={file}
                            onDrop={handleDrop}
                            onDelete={() => setFile(null)}
                        />
                    </Box>
                )}

                {status === 'uploading' && (
                    <Box sx={{ py: 10, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>{t('import_ai.processing')}</Typography>
                        <Typography variant="body2" color="text.secondary">{t('import_ai.analyzing')}</Typography>
                    </Box>
                )}

                {(status === 'complete' || status === 'saving') && renderResult()}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit" disabled={status === 'saving' || status === 'uploading'}>{t('cancel')}</Button>
                {(status === 'idle' || status === 'uploading') && (
                    <LoadingButton
                        variant="contained"
                        disabled={!file}
                        onClick={handleUpload}
                        loading={status === 'uploading'}
                    >
                        {t('import_ai.upload') || 'Next'}
                    </LoadingButton>
                )}
            </DialogActions>
        </Dialog>
    );
}
