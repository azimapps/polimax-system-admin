import { useState, useEffect } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { fData, fPercent } from 'src/utils/format-number';
import { type CompressionStats, compressImageWithStats } from 'src/utils/image-utils';

import { useTranslate } from 'src/locales';

import { Iconify } from '../../iconify';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    files: File[];
    onComplete: (compressedFiles: File[]) => void;
};

export function CompressionMultiDialog({ open, onClose, files, onComplete }: Props) {
    const { t } = useTranslate('common');

    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<{ file: File; stats: CompressionStats }[]>([]);

    useEffect(() => {
        if (open && files.length > 0) {
            handleProcess();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, files]);

    const handleProcess = async () => {
        setLoading(true);
        try {
            const processed = await Promise.all(
                files.map(async (file) => {
                    if (file.type.startsWith('image/')) {
                        return compressImageWithStats(file);
                    }
                    return {
                        file,
                        stats: { originalSize: file.size, compressedSize: file.size, percentageSaved: 0 }
                    };
                })
            );
            setResults(processed);
        } catch (error) {
            console.error('Compression failed', error);
        } finally {
            setLoading(false);
        }
    };

    const totalOriginal = results.reduce((acc, curr) => acc + curr.stats.originalSize, 0);
    const totalCompressed = results.reduce((acc, curr) => acc + curr.stats.compressedSize, 0);
    const totalSavings = totalOriginal > 0 ? ((totalOriginal - totalCompressed) / totalOriginal) * 100 : 0;

    const handleSave = () => {
        onComplete(results.map((r) => r.file));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ textAlign: 'center' }}>
                {loading ? t('processing...') || 'Siqilmoqda...' : t('compression_summary') || 'Siqish natijasi'}
            </DialogTitle>

            <DialogContent sx={{ py: 3 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 5, gap: 2 }}>
                        <CircularProgress size={48} thickness={4} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {t('optimizing_images') || 'Rasmlar optimallashtirilmoqda...'}
                        </Typography>
                    </Box>
                ) : (
                    <Stack spacing={3}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    bgcolor: 'success.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'common.white',
                                    boxShadow: (theme) => `0 0 0 8px ${varAlpha(theme.vars.palette.success.mainChannel, 0.08)}`
                                }}
                            >
                                <Iconify icon="solar:check-circle-bold" width={40} />
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                p: 3,
                                bgcolor: (theme) => varAlpha(theme.vars.palette.grey['800Channel'], 0.12),
                                borderRadius: 2,
                                border: (theme) => `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
                            }}
                        >
                            <Stack spacing={1.5}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {t('original_size')}
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'fontWeightBold' }}>
                                        {fData(totalOriginal)}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {t('optimized_size')}
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ color: 'success.main', fontWeight: 'fontWeightBold' }}>
                                        {fData(totalCompressed)}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: (theme) => `dashed 1px ${theme.vars.palette.divider}` }}>
                                    <Typography variant="subtitle2" sx={{ color: 'success.main', fontWeight: 'fontWeightBold' }}>
                                        {t('savings')}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 'fontWeightBold' }}>
                                        {fPercent(totalSavings)}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Stack>
                )}
            </DialogContent>

            {!loading && (
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={onClose} variant="outlined" color="inherit">
                        {t('back')}
                    </Button>
                    <Button onClick={handleSave} variant="contained" color="success" fullWidth>
                        {t('save')}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
}
