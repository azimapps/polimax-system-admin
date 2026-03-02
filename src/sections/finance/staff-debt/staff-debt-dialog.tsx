import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useGetStaff } from 'src/hooks/use-staff';
import { useCreateStaffDebt } from 'src/hooks/use-staff-debt';

import { fDate } from 'src/utils/format-time';

import { Form, Field } from 'src/components/hook-form';

import { getStaffDebtSchema } from './staff-debt-schema';

type Props = {
    open: boolean;
    onClose: () => void;
};

export function StaffDebtDialog({ open, onClose }: Props) {
    const { mutateAsync: createDebt } = useCreateStaffDebt();
    const { data: staffList = [] } = useGetStaff();

    const [staffTypeFilter, setStaffTypeFilter] = useState<string>('all');

    const staffTypes = useMemo(() => Array.from(new Set(staffList.map((s) => s.type))), [staffList]);

    const filteredStaff = useMemo(() => {
        if (staffTypeFilter === 'all') return staffList;
        return staffList.filter((s) => s.type === staffTypeFilter);
    }, [staffList, staffTypeFilter]);

    const defaultValues = useMemo(
        () => ({
            staff_id: 0,
            amount: 0,
            reason: '',
            date: fDate(new Date(), 'YYYY-MM-DDTHH:mm:ss'),
            notes: '',
        }),
        []
    );

    const methods = useForm({
        resolver: zodResolver(getStaffDebtSchema()) as any,
        defaultValues,
    });

    const {
        reset,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (open) {
            reset(defaultValues);
        }
    }, [open, reset, defaultValues]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            await createDebt(data);
            onClose();
            reset();
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>Yangi Qarz / Avans</DialogTitle>

                <DialogContent>
                    <Box
                        rowGap={3}
                        columnGap={2}
                        display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            select
                            fullWidth
                            label="Xodim turi (Filter)"
                            value={staffTypeFilter}
                            onChange={(e) => {
                                setStaffTypeFilter(e.target.value);
                                setValue('staff_id', 0);
                            }}
                            SelectProps={{ native: true }}
                            InputLabelProps={{ shrink: true }}
                        >
                            <option value="all">Barchasi</option>
                            {staffTypes.map((type) => (
                                <option key={type} value={type} style={{ textTransform: 'capitalize' }}>
                                    {type}
                                </option>
                            ))}
                        </TextField>

                        <Field.Select
                            name="staff_id"
                            label="Xodim"
                            InputLabelProps={{ shrink: true }}
                        >
                            <option value={0} disabled>
                                {filteredStaff.length === 0 ? 'Xodimlar topilmadi' : 'Xodimni tanlang'}
                            </option>
                            {filteredStaff.map((staff) => (
                                <option key={staff.id} value={staff.id}>
                                    {staff.fullname} {staffTypeFilter === 'all' ? `(${staff.type})` : ''}
                                </option>
                            ))}
                        </Field.Select>

                        <Field.Text type="number" name="amount" label="Summa" />

                        <Field.Select
                            name="reason"
                            label="Sabab"
                            InputLabelProps={{ shrink: true }}
                        >
                            <option value="" disabled>Sababni tanlang</option>
                            <option value="avans">Avans</option>
                            <option value="qarz">Qarz</option>
                            <option value="boshqa">Boshqa</option>
                        </Field.Select>

                        <Field.DatePicker name="date" label="Sana" />

                        <Box sx={{ gridColumn: '1 / -1' }}>
                            <Field.Text multiline rows={3} name="notes" label="Izoh (ixtiyoriy)" />
                        </Box>
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
