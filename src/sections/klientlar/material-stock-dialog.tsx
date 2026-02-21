import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetOmborMaterialsByDavaldiylik } from 'src/hooks/use-ombor';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { EmptyContent } from 'src/components/empty-content';

import { OmborType } from 'src/types/ombor';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    materialId: number;
    materialName?: string;
};

export function MaterialStockDialog({ open, onClose, materialId, materialName }: Props) {
    const { t } = useTranslate('ombor');
    const { data: stocks = [], isLoading } = useGetOmborMaterialsByDavaldiylik(materialId);

    const getQuantityDisplay = (item: any) => {
        switch (item.ombor_type) {
            case OmborType.PLYONKA:
            case OmborType.KRASKA:
            case OmborType.SUYUQ_KRASKA:
            case OmborType.OTXOT:
                return `${item.total_kg || 0} kg`;
            case OmborType.RASTVARITEL:
            case OmborType.ARALASHMASI:
                return `${item.total_liter || 0} L`;
            default:
                return `${item.quantity || item.barrels || 0} dona/bochka`;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                {materialName ? `${materialName} - ` : ''} Ombor Qoldiqlari
            </DialogTitle>

            <DialogContent sx={{ minHeight: 400, pb: 2, pt: 2 }}>
                {isLoading ? (
                    <Box alignItems="center" display="flex" justifyContent="center" minHeight={400}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        {stocks.length === 0 ? (
                            <EmptyContent title="Omborda xomashyo topilmadi" sx={{ py: 10 }} />
                        ) : (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t('form.date')}</TableCell>
                                        <TableCell>Tur</TableCell>
                                        <TableCell>{t('form.name')}</TableCell>
                                        <TableCell align="center">{t('form.quantity')}</TableCell>
                                        <TableCell align="center">{t('form.price')}</TableCell>
                                        <TableCell>{t('form.description')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stocks.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                {fDate(item.date)}
                                            </TableCell>
                                            <TableCell sx={{ textTransform: 'capitalize' }}>
                                                {item.ombor_type.replace('_', ' ')}
                                            </TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                                {getQuantityDisplay(item)}
                                            </TableCell>
                                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                                {fCurrency(item.price || (item.price_per_kg ? item.price_per_kg * (item.total_kg || 0) : 0))} {item.price_currency?.toUpperCase()}
                                            </TableCell>
                                            <TableCell>{item.description || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </TableContainer>
                )}
            </DialogContent>

            <DialogActions>
                <Button color="inherit" onClick={onClose} variant="outlined">
                    Yopish
                </Button>
            </DialogActions>
        </Dialog>
    );
}
