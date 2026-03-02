import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useRecordStaffDebtPayment } from 'src/hooks/use-staff-debt';

import { fDate } from 'src/utils/format-time';

import { Form, Field } from 'src/components/hook-form';

import { getStaffDebtPaymentSchema } from './staff-debt-schema';

type Props = {
    open: boolean;
    onClose: () => void;
    debtId?: number;
};

export function StaffDebtPaymentDialog({ open, onClose, debtId }: Props) {
    const { mutateAsync: recordPayment } = useRecordStaffDebtPayment();

    const defaultValues = useMemo(
        () => ({
            amount: 0,
            payment_method: 'naqd',
            date: fDate(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
            notes: '',
        }),
        []
    );

    const methods = useForm({
        resolver: zodResolver(getStaffDebtPaymentSchema()) as any,
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (open) {
            reset(defaultValues);
        }
    }, [open, reset, defaultValues]);

    const onSubmit = handleSubmit(async (data) => {
        if (!debtId) return;
        try {
            await recordPayment({ id: debtId, data });
            onClose();
            reset();
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>To&apos;lov qilish</DialogTitle>

                <DialogContent>
                    <Box
                        rowGap={3}
                        columnGap={2}
                        display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(1, 1fr)',
                        }}
                        sx={{ mt: 1 }}
                    >
                        <Field.Text type="number" name="amount" label="To'lov summasi" />

                        <Field.Select
                            name="payment_method"
                            label="To'lov turi"
                            InputLabelProps={{ shrink: true }}
                        >
                            <option value="naqd">Naqd</option>
                            <option value="bank">Bank o&apos;tkazmasi</option>
                            <option value="salary_deduction">Oylikdan ushlanish</option>
                        </Field.Select>

                        <Field.DatePicker name="date" label="To'lov sanasi" />

                        <Field.Text multiline rows={3} name="notes" label="Izoh (ixtiyoriy)" />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>
                        Bekor qilish
                    </Button>

                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Saqlash
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    );
}
