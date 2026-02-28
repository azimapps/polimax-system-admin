
import type { StanokType } from 'src/types/stanok';
import type { Brigada, CreateBrigadaRequest, UpdateBrigadaRequest } from 'src/types/brigada';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { useGetStaff } from 'src/hooks/use-staff';
import { useCreateBrigada, useUpdateBrigada, useGetAssignedWorkers } from 'src/hooks/use-brigadas';

import { useTranslate } from 'src/locales';
import { brigadaApi } from 'src/api/brigada-api';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { StaffType } from 'src/types/staff';

import { getBrigadaSchema } from './brigada-schema';

// ----------------------------------------------------------------------

type Props = {
    brigada?: Brigada;
    machineId: number;
    machineType: StanokType;
    onSuccess?: () => void;
};

export function BrigadaForm({ brigada, machineId, machineType, onSuccess }: Props) {
    const { t } = useTranslate('stanok');
    const isEdit = !!brigada;

    const { mutateAsync: createBrigada, isPending: isCreating } = useCreateBrigada();
    const { mutateAsync: updateBrigada, isPending: isUpdating } = useUpdateBrigada(brigada?.id || 0);

    const { data: workers = [] } = useGetStaff(undefined, StaffType.WORKER, machineType as any);

    const { assignedLeaders, assignedMembers } = useGetAssignedWorkers(machineType);

    const workerOptions = workers
        .filter((w) => {
            if (isEdit && w.fullname === brigada?.leader) return true;
            if (assignedLeaders.has(w.fullname)) return false;
            if (assignedMembers.has(w.id)) return false;
            return true;
        })
        .map((w) => w.fullname);

    const isPending = isCreating || isUpdating;

    const defaultValues = useMemo(
        () => ({
            name: brigada?.name || '',
            leader: brigada?.leader || '',
            leader_id: brigada?.leader_id || undefined,
            machine_id: machineId,
            machine_type: machineType,
        }),
        [brigada, machineId, machineType]
    );

    const methods = useForm<CreateBrigadaRequest>({
        resolver: zodResolver(getBrigadaSchema(t)),
        defaultValues,
    });

    const { handleSubmit } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const selectedWorker = workers.find((w) => w.fullname === data.leader);
            if (selectedWorker) {
                data.leader_id = selectedWorker.id;
            }

            if (isEdit) {
                await updateBrigada(data as UpdateBrigadaRequest);
                if (data.leader_id && brigada?.leader_id !== data.leader_id) {
                    try {
                        await brigadaApi.addBrigadaMember(brigada!.id, {
                            worker_id: data.leader_id,
                            position: 'operator',
                        });
                    } catch (e) {
                        console.error('Failed to add new leader as member', e);
                    }
                }
                toast.success(t('messages.success_update'));
            } else {
                const newBrigada = await createBrigada(data);
                if (newBrigada?.id && data.leader_id) {
                    try {
                        await brigadaApi.addBrigadaMember(newBrigada.id, {
                            worker_id: data.leader_id,
                            position: 'operator',
                        });
                    } catch (e) {
                        console.error('Failed to add leader as member', e);
                    }
                }
                toast.success(t('messages.success_create'));
            }
            onSuccess?.();
        } catch (error) {
            console.error(error);
            toast.error(t('messages.error_generic'));
        }
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3} sx={{ pt: 1 }}>
                <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                    }}
                >
                    <Field.Text name="name" label={t('brigada.form.name')} required />
                    <Field.Autocomplete
                        name="leader"
                        label={t('brigada.form.leader')}
                        options={workerOptions}
                        freeSolo
                    />
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" color="inherit" onClick={onSuccess}>
                        {t('cancel')}
                    </Button>
                    <LoadingButton type="submit" variant="contained" loading={isPending}>
                        {isEdit ? t('update') : t('create')}
                    </LoadingButton>
                </Stack>
            </Stack>
        </Form>
    );
}
