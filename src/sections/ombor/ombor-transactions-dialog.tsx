import type { CreateOmborTransactionRequest } from 'src/types/ombor';

import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { useGetStanoklar } from 'src/hooks/use-stanok';
import { useGetPlanItems } from 'src/hooks/use-plan-items';
import { useGetOmborTransactions, useCreateOmborTransaction } from 'src/hooks/use-ombor';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { Scrollbar } from 'src/components/scrollbar';
import { Form, Field } from 'src/components/hook-form';

import { OmborType, OmborTransactionType } from 'src/types/ombor';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    id?: number;
    type: OmborType;
};

export function OmborTransactionsDialog({ open, onClose, id, type }: Props) {
    const { t } = useTranslate('ombor');
    const [currentTab, setCurrentTab] = useState<string>('all');
    const [isCreating, setIsCreating] = useState<OmborTransactionType | null>(null);

    const { data: transactions = [], isLoading } = useGetOmborTransactions(id || 0, currentTab === 'all' ? undefined : currentTab);
    const { mutateAsync: createTransaction, isPending: isCreatingTx } = useCreateOmborTransaction(id || 0, type);

    const { data: planItems = [] } = useGetPlanItems();
    const { data: stanoklar = [] } = useGetStanoklar();

    const methods = useForm<CreateOmborTransactionRequest>({
        defaultValues: {
            transaction_type: OmborTransactionType.KIRIM,
            date: new Date().toISOString().split('T')[0],
        }
    });

    const { reset, handleSubmit } = methods;

    const handleClose = () => {
        setIsCreating(null);
        reset();
        onClose();
    };

    const handleNewTransaction = (txType: OmborTransactionType) => {
        setIsCreating(txType);
        reset({
            transaction_type: txType,
            date: new Date().toISOString().slice(0, 16),
            quantity_kg: null as any,
            quantity_liter: null as any,
            quantity_count: null as any,
            quantity_barrels: null as any,
            plan_item_id: null as any,
            stanok_id: null as any,
            notes: '',
        });
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            await createTransaction({
                ...data,
                date: new Date(data.date).toISOString(),
            });
            setIsCreating(null);
            reset();
        } catch (error: any) {
            const message = error?.response?.data?.detail || 'Xatolik yuz berdi';
            toast.error(message);
        }
    });

    const renderForm = () => {
        const showKg = [OmborType.PLYONKA, OmborType.KRASKA, OmborType.SUYUQ_KRASKA, OmborType.OTXOT].includes(type);
        const showLiter = [OmborType.RASTVARITEL, OmborType.ARALASHMASI].includes(type);
        const showCount = !showKg && !showLiter;
        const showBarrels = [OmborType.RASTVARITEL, OmborType.ARALASHMASI].includes(type);

        return (
            <Form methods={methods} onSubmit={onSubmit}>
                <Box gap={3} display="flex" flexDirection="column" sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">
                        {isCreating === OmborTransactionType.KIRIM ? t('transactions.new_kirim') : t('transactions.new_chiqim')}
                    </Typography>

                    <Field.Text
                        name="date"
                        label={t('transactions.table.date')}
                        type="datetime-local"
                        InputLabelProps={{ shrink: true }}
                        required
                    />

                    {showKg && <Field.Text name="quantity_kg" label={t('transactions.form.quantity_kg')} type="number" required />}
                    {showLiter && <Field.Text name="quantity_liter" label={t('transactions.form.quantity_liter')} type="number" required />}
                    {showCount && <Field.Text name="quantity_count" label={t('transactions.form.quantity_count')} type="number" required />}
                    {showBarrels && <Field.Text name="quantity_barrels" label={t('transactions.form.quantity_barrels')} type="number" />}

                    {isCreating === OmborTransactionType.CHIQIM && (
                        <>
                            <Field.Select name="plan_item_id" label={t('transactions.form.plan_item_id')} required>
                                {planItems.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', py: 0.5 }}>
                                            <Typography variant="subtitle2" component="span">
                                                {t('transactions.buyurtma')} #{item.order_id || item.id}
                                                {item.order_title && ` — ${item.order_title}`}
                                            </Typography>
                                            {(item.brigada_name || item.quantity_kg || item.machine_name) && (
                                                <Typography variant="caption" component="span" sx={{ color: 'text.secondary' }}>
                                                    {[
                                                        item.brigada_name,
                                                        item.quantity_kg && `${item.quantity_kg} kg`,
                                                        item.machine_name,
                                                    ].filter(Boolean).join(' • ')}
                                                </Typography>
                                            )}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Field.Select>

                            <Field.Select name="stanok_id" label={t('transactions.form.stanok_id')} required>
                                {stanoklar.map((stanok) => (
                                    <MenuItem key={stanok.id} value={stanok.id}>
                                        {stanok.name}
                                    </MenuItem>
                                ))}
                            </Field.Select>
                        </>
                    )}

                    <Field.Text name="notes" label={t('transactions.form.notes')} multiline rows={3} />

                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button variant="outlined" onClick={() => setIsCreating(null)}>
                            {t('cancel')}
                        </Button>
                        <Button type="submit" variant="contained" loading={isCreatingTx}>
                            {t('transactions.title')}
                        </Button>
                    </Box>
                </Box>
            </Form>
        );
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ pb: 2 }}>{t('transactions.title')}</DialogTitle>

            <DialogContent sx={{ minHeight: 400 }}>
                {!isCreating ? (
                    <>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Tabs value={currentTab} onChange={(_, val) => setCurrentTab(val)}>
                                <Tab value="all" label={t('transactions.all')} />
                                <Tab value={OmborTransactionType.KIRIM} label={t('transactions.kirim')} />
                                <Tab value={OmborTransactionType.CHIQIM} label={t('transactions.chiqim')} />
                            </Tabs>

                            <Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => handleNewTransaction(OmborTransactionType.KIRIM)}
                                    sx={{ mr: 1 }}
                                >
                                    {t('transactions.new_kirim')}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => handleNewTransaction(OmborTransactionType.CHIQIM)}
                                >
                                    {t('transactions.new_chiqim')}
                                </Button>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <Scrollbar sx={{ maxHeight: 300 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t('transactions.table.date')}</TableCell>
                                        <TableCell>{t('transactions.table.type')}</TableCell>
                                        <TableCell>{t('transactions.table.quantity')}</TableCell>
                                        <TableCell>{t('transactions.table.plan_item_id')}</TableCell>
                                        <TableCell>{t('transactions.table.stanok_id')}</TableCell>
                                        <TableCell>{t('transactions.table.notes')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactions.map((tx) => (
                                        <TableRow key={tx.id}>
                                            <TableCell>{fDate(tx.date)}</TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        color: tx.transaction_type === 'kirim' ? 'success.main' : 'error.main',
                                                        fontWeight: 'bold',
                                                        textTransform: 'capitalize'
                                                    }}
                                                >
                                                    {t(`transactions.${tx.transaction_type}`)}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {tx.quantity_kg ? `${tx.quantity_kg} kg ` : ''}
                                                {tx.quantity_liter ? `${tx.quantity_liter} L ` : ''}
                                                {tx.quantity_count ? `${tx.quantity_count} dona ` : ''}
                                                {tx.quantity_barrels ? `(${tx.quantity_barrels} bochka)` : ''}
                                            </TableCell>
                                            <TableCell>
                                                {tx.plan_item_id ? (() => {
                                                    const plan = planItems.find(p => p.id === tx.plan_item_id);
                                                    return plan ? (
                                                        <Box>
                                                            <Typography variant="body2" fontWeight="bold">
                                                                #{plan.order_id || tx.plan_item_id}
                                                                {plan.order_title && ` — ${plan.order_title}`}
                                                            </Typography>
                                                            {plan.brigada_name && (
                                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                                    {plan.brigada_name}
                                                                    {plan.quantity_kg && ` • ${plan.quantity_kg} kg`}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    ) : `#${tx.plan_item_id}`;
                                                })() : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {tx.stanok_id ? stanoklar.find(s => s.id === tx.stanok_id)?.name || tx.stanok_id : '-'}
                                            </TableCell>
                                            <TableCell>{tx.notes || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                    {transactions.length === 0 && !isLoading && (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                <Typography variant="body2" sx={{ color: 'text.secondary', p: 2 }}>
                                                    {t('transactions.empty')}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </>
                ) : (
                    renderForm()
                )}
            </DialogContent>
        </Dialog>
    );
}
