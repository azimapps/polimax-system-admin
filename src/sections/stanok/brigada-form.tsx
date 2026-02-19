
import type { StanokType } from 'src/types/stanok';
import type { Brigada, CreateBrigadaRequest, UpdateBrigadaRequest } from 'src/types/brigada';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { useCreateBrigada, useUpdateBrigada } from 'src/hooks/use-brigadas';

import { useTranslate } from 'src/locales';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

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

    const isPending = isCreating || isUpdating;

    const defaultValues = useMemo(
        () => ({
            name: brigada?.name || '',
            leader: brigada?.leader || '',
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
            if (isEdit) {
                await updateBrigada(data as UpdateBrigadaRequest);
                toast.success(t('messages.success_update'));
            } else {
                await createBrigada(data);
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
                    <Field.Text name="leader" label={t('brigada.form.leader')} />
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
