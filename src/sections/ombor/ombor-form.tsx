
import type { OmborItem, CreateOmborRequest } from 'src/types/ombor';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslate } from 'src/locales';

import { Form, Field } from 'src/components/hook-form';

import { OmborCategory } from 'src/types/ombor';

import { getOmborSchema } from './ombor-schema';

// ----------------------------------------------------------------------

type Props = {
    item?: OmborItem;
    onSuccess?: () => void;
    onCancel?: () => void;
};

export function OmborForm({ item, onSuccess, onCancel }: Props) {
    const { t } = useTranslate('ombor');
    const isEdit = !!item;

    const methods = useForm<CreateOmborRequest>({
        resolver: zodResolver(getOmborSchema(t)),
        defaultValues: {
            name: item?.name || '',
            category: item?.category || [],
            quantity: item?.quantity || 0,
            unit: item?.unit || 'kg',
            price: item?.price || 0,
            currency: item?.currency || 'uzs',
            batch_number: item?.batch_number || '',
            notes: item?.notes || '',
        },
    });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
        if (item) {
            reset({
                name: item.name,
                category: item.category,
                quantity: item.quantity,
                unit: item.unit,
                price: item.price,
                currency: item.currency,
                batch_number: item.batch_number,
                notes: item.notes,
            });
        }
    }, [item, reset]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            // In a real app, we would call the API here
            console.log('Ombor Form Data:', data);
            onSuccess?.();
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3} sx={{ pt: 2 }}>
                <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                    }}
                >
                    <Field.Text
                        name="name"
                        label={t('form.name') || 'Material Nomi'}
                        placeholder={t('form.name') || 'Material Nomi'}
                        InputLabelProps={{ shrink: true }}
                        required
                    />

                    <Field.Autocomplete
                        name="category"
                        label={t('form.category')}
                        placeholder={t('form.select_category')}
                        multiple
                        options={Object.values(OmborCategory)}
                        getOptionLabel={(option) => t(`form.categories.${option as string}`)}
                        sx={{ gridColumn: 'span 2' }}
                        slotProps={{
                            textfield: {
                                InputLabelProps: { shrink: true }
                            }
                        }}
                    />

                    <Field.Text
                        name="quantity"
                        label={t('form.quantity') || 'Miqdor'}
                        placeholder={t('form.quantity') || 'Miqdor'}
                        InputLabelProps={{ shrink: true }}
                        type="number"
                        required
                    />
                    <Field.Text
                        name="unit"
                        label={t('form.unit') || 'Birlik'}
                        placeholder={t('form.unit') || 'Birlik'}
                        InputLabelProps={{ shrink: true }}
                        required
                    />

                    <Field.Text
                        name="price"
                        label={t('form.price') || 'Narxi'}
                        placeholder={t('form.price') || 'Narxi'}
                        InputLabelProps={{ shrink: true }}
                        type="number"
                        required
                    />
                    <Field.Select
                        name="currency"
                        label={t('form.currency') || 'Valyuta'}
                        InputLabelProps={{ shrink: true }}
                    >
                        <MenuItem value="uzs">UZS</MenuItem>
                        <MenuItem value="usd">USD</MenuItem>
                    </Field.Select>

                    <Field.Text
                        name="batch_number"
                        label={t('form.batch_number') || 'Partiya raqami'}
                        placeholder={t('form.batch_number') || 'Partiya raqami'}
                        InputLabelProps={{ shrink: true }}
                    />
                    <Field.Text
                        name="notes"
                        label={t('form.notes') || 'Izoh'}
                        placeholder={t('form.notes') || 'Izoh'}
                        InputLabelProps={{ shrink: true }}
                        multiline
                        rows={3}
                        sx={{ gridColumn: 'span 2' }}
                    />
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" color="inherit" onClick={onCancel}>
                        {t('cancel') || 'Bekor qilish'}
                    </Button>
                    <LoadingButton type="submit" variant="contained">
                        {isEdit ? (t('update') || 'Saqlash') : (t('create') || 'Qo\'shish')}
                    </LoadingButton>
                </Stack>
            </Stack>
        </Form>
    );
}
