
import type { StaffType } from 'src/types/staff';
import type { CreateBrigadaMemberRequest } from 'src/types/brigada';

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useGetStaff } from 'src/hooks/use-staff';
import { useAddBrigadaMember, useGetBrigadaMembers, useDeleteBrigadaMember } from 'src/hooks/use-brigadas';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { getBrigadaMemberSchema } from './brigada-schema';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: () => void;
    brigadaId: number;
    brigadaName: string;
};

export function BrigadaMemberDialog({ open, onClose, brigadaId, brigadaName }: Props) {
    const { t } = useTranslate('stanok');

    const { data: members = [], isLoading: isMembersLoading } = useGetBrigadaMembers(brigadaId);
    const { data: staffData = [] } = useGetStaff('', 'worker' as StaffType);

    // Sort staff to show only those not in brigada (optional UX)
    const availableWorkers = staffData;

    const { mutateAsync: addMember, isPending: isAdding } = useAddBrigadaMember(brigadaId);
    const { mutateAsync: deleteMember } = useDeleteBrigadaMember(brigadaId);

    const methods = useForm<CreateBrigadaMemberRequest>({
        resolver: zodResolver(getBrigadaMemberSchema(t)) as any,
        defaultValues: {
            worker_id: 0,
            position: '',
        },
    });

    const { reset, handleSubmit } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await addMember(data);
            toast.success('Member added');
            reset();
        } catch (error) {
            console.error(error);
            toast.error(t('messages.error_generic'));
        }
    });

    const handleDelete = useCallback(async (memberId: number) => {
        try {
            await deleteMember(memberId);
            toast.success('Member removed');
        } catch (error) {
            console.error(error);
            toast.error(t('messages.error_generic'));
        }
    }, [deleteMember, t]);

    const getWorkerName = (workerId: number) => {
        const worker = staffData.find((s) => s.id === workerId);
        return worker ? worker.fullname : `Worker #${workerId}`;
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                {t('brigada.member.list_title')} - {brigadaName}
            </DialogTitle>
            <DialogContent sx={{ pb: 3 }}>
                <Form methods={methods} onSubmit={onSubmit}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, pt: 1 }}>
                        <Field.Select name="worker_id" label={t('brigada.form.worker')} sx={{ minWidth: 200 }} required>
                            <MenuItem value={0}>None</MenuItem>
                            {availableWorkers.map((worker) => (
                                <MenuItem key={worker.id} value={worker.id}>
                                    {worker.fullname}
                                </MenuItem>
                            ))}
                        </Field.Select>
                        <Field.Text name="position" label={t('brigada.form.position')} sx={{ flexGrow: 1 }} required />
                        <LoadingButton type="submit" variant="contained" loading={isAdding} startIcon={<Iconify icon="mingcute:add-line" />}>
                            {t('brigada.member.add')}
                        </LoadingButton>
                    </Stack>
                </Form>

                <Card sx={{ mt: 2 }}>
                    <TableContainer sx={{ position: 'relative', minHeight: 120 }}>
                        {isMembersLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        )}
                        {!isMembersLoading && (
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t('brigada.form.worker')}</TableCell>
                                        <TableCell>{t('brigada.form.position')}</TableCell>
                                        <TableCell align="right">{t('table.actions')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {members.map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell>{getWorkerName(member.worker_id)}</TableCell>
                                            <TableCell>{member.position}</TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDelete(member.id)}
                                                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                                                >
                                                    {t('brigada.member.delete')}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {members.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                                                No members found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </TableContainer>
                </Card>
            </DialogContent>
        </Dialog>
    );
}
