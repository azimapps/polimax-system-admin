import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetBrigadas } from 'src/hooks/use-brigadas';
import { useLogProduction, useGetMachineStock, useTransferPlanItem, useLogMaterialUsage } from 'src/hooks/use-material-usage';

type Props = {
    open: boolean;
    onClose: () => void;
    planItemId: number | null;
};

export function ActionDialog({ open, onClose, planItemId }: Props) {
    const { data: stock = [], isLoading: isStockLoading } = useGetMachineStock();
    const { data: brigadas = [] } = useGetBrigadas();

    // Form state
    const [usageAmounts, setUsageAmounts] = useState<Record<number, string>>({});
    const [meters, setMeters] = useState('');
    const [kg, setKg] = useState('');
    const [dispatchTo, setDispatchTo] = useState('');

    const logProd = useLogProduction();
    const trans = useTransferPlanItem(planItemId || 0);
    const logUsage = useLogMaterialUsage();

    if (!planItemId) return null;

    const handleSave = async () => {
        try {
            // Log Production if filled
            if (meters || kg) {
                await logProd.mutateAsync({
                    plan_item_id: planItemId,
                    meters_produced: Number(meters) || 0,
                    kg_produced: Number(kg) || 0,
                });
            }

            // In real app we also map over usageAmounts and fire logUsage.mutateAsync() here.
            // But we need ombor_transaction_id. For now, doing just production and transfer.

            // Transfer if dispatch chosen
            if (dispatchTo) {
                await trans.mutateAsync({
                    to_brigada_id: Number(dispatchTo)
                });
            }

            onClose();
        } catch (error) {
            console.error('Error saving:', error);
        }
    };

    const isSaving = logProd.isPending || trans.isPending || logUsage.isPending;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#212B36', backgroundImage: 'none', borderRadius: 2 } }}>
            <DialogTitle sx={{ pb: 2, pt: 3, px: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Statusni yangilash</Typography>
            </DialogTitle>

            <DialogContent sx={{ px: 3, pb: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Materials Section */}
                <Box sx={{ bgcolor: '#28323D', borderRadius: 1.5, overflow: 'hidden' }}>
                    <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(145, 158, 171, 0.12)' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Mavjud materiallar</Typography>
                        <Button variant="outlined" size="small" sx={{ borderColor: 'rgba(145, 158, 171, 0.24)', color: 'text.primary', '&:hover': { borderColor: 'text.primary' } }}>
                            Hammasini olish
                        </Button>
                    </Box>

                    {isStockLoading ? (
                        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} /></Box>
                    ) : stock.length === 0 ? (
                        <Typography variant="body2" sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>Uskunada materiallar topilmadi</Typography>
                    ) : stock.map((mat, idx) => (
                        <Box key={mat.ombor_item_id} sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: idx !== stock.length - 1 ? '1px solid rgba(145, 158, 171, 0.12)' : 'none' }}>
                            <Typography variant="body2" sx={{ flexGrow: 1 }}>{mat.ombor_item_name}</Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, ml: 2 }}>
                                <Typography variant="subtitle2" sx={{ minWidth: 60, textAlign: 'right', color: 'info.main' }}>
                                    {mat.stock_at_machine} kg/l
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TextField
                                        size="small"
                                        placeholder="0"
                                        value={usageAmounts[mat.ombor_item_id] || ''}
                                        onChange={(e) => setUsageAmounts({ ...usageAmounts, [mat.ombor_item_id]: e.target.value })}
                                        sx={{
                                            width: 80,
                                            '& .MuiOutlinedInput-root': {
                                                bgcolor: 'rgba(255, 255, 255, 0.04)',
                                                '& fieldset': { borderColor: 'rgba(145, 158, 171, 0.24)' },
                                            }
                                        }}
                                        inputProps={{ style: { textAlign: 'center' } }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* Production Section */}
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>Jami ishlab chiqarilgan (Ushbu smena/partiya)</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2, fontStyle: 'italic' }}>
                        Kiritilgan miqdor umumiy soniga qo&apos;shiladi (+).
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Metr (Qo'shish +)"
                            placeholder="0"
                            value={meters}
                            onChange={(e) => setMeters(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'transparent' } }}
                        />
                        <TextField
                            fullWidth
                            label="Kg (Qo'shish +)"
                            placeholder="0"
                            value={kg}
                            onChange={(e) => setKg(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'transparent' } }}
                        />
                    </Box>
                </Box>

                {/* Dispatch Section */}
                <Box sx={{ border: '1px dashed rgba(145, 158, 171, 0.24)', borderRadius: 1.5, p: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: 'success.main', fontWeight: 600, mb: 2 }}>Yuborish (Dispatch)</Typography>
                    <FormControl fullWidth>
                        <InputLabel>Qayerga yuborish?</InputLabel>
                        <Select
                            label="Qayerga yuborish?"
                            value={dispatchTo}
                            onChange={(e) => setDispatchTo(e.target.value)}
                        >
                            <MenuItem value="">Hech qayerga</MenuItem>
                            {brigadas.map((b: any) => (
                                <MenuItem key={b.id} value={String(b.id)}>{b.name} ({b.machine_type})</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0, borderTop: '1px dashed rgba(145, 158, 171, 0.12)' }}>
                <Button onClick={onClose} sx={{ color: 'text.primary', fontWeight: 600 }} disabled={isSaving}>Bekor qilish</Button>
                <Button variant="contained" onClick={handleSave} disabled={isSaving} sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.24)' } }}>
                    {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Saqlash'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
