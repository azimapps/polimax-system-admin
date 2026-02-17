
import type { OmborItem, CreateOmborRequest } from 'src/types/ombor';

import { useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslate } from 'src/locales';
import { omborApi } from 'src/api/ombor-api';

import { Form, Field } from 'src/components/hook-form';

import {
    OmborType,
    PriceCurrency,
    SolventType,
    CylinderOrigin,
    PlyonkaCategory
} from 'src/types/ombor';

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

    const defaultValues = useMemo(() => ({
        ombor_type: item?.ombor_type || OmborType.PLYONKA,
        name: item?.name || '',
        date: item?.date || new Date().toISOString(),
        description: item?.description || '',
        price_currency: item?.price_currency || PriceCurrency.USD,
        supplier_id: item?.supplier_id || null,
        client_id: item?.client_id || null,

        // Plyonka
        plyonka_category: item?.plyonka_category || null,
        plyonka_subcategory: item?.plyonka_subcategory || '',
        thickness: item?.thickness || null,
        width: item?.width || null,

        // Kraska
        barrels: item?.barrels || null,
        color_name: item?.color_name || '',
        color_hex: item?.color_hex || '#000000',
        marka: item?.marka || '',

        // Totals
        total_kg: item?.total_kg || null,
        total_liter: item?.total_liter || null,
        quantity: item?.quantity || null,

        // Prices
        price_per_kg: item?.price_per_kg || null,
        price_per_liter: item?.price_per_liter || null,
        price: item?.price || null,

        // Silindr
        seriya_number: item?.seriya_number || '',
        origin: item?.origin || null,
        length: item?.length || null,
        diameter: item?.diameter || null,
        usage: item?.usage || 0,
        usage_limit: item?.usage_limit || null,

        // Solvent
        solvent_type: item?.solvent_type || null,

        // Tayyor
        product_type: item?.product_type || '',
        net_weight: item?.net_weight || null,
        gross_weight: item?.gross_weight || null,
        total_net_weight: item?.total_net_weight || null,
        total_gross_weight: item?.total_gross_weight || null,
    }), [item]);

    const methods = useForm<CreateOmborRequest>({
        resolver: zodResolver(getOmborSchema(t)),
        defaultValues,
    });

    const { handleSubmit, reset, watch: watchForm, formState: { isSubmitting } } = methods;

    const currentType = watchForm('ombor_type');

    useEffect(() => {
        if (item) {
            reset(defaultValues);
        }
    }, [item, reset, defaultValues]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (isEdit && item) {
                await omborApi.updateOmborItem(item.id, data);
            } else {
                await omborApi.createOmborItem(data);
            }
            onSuccess?.();
        } catch (error) {
            console.error(error);
        }
    });

    const renderCommonFields = (
        <>
            <Field.Select
                name="ombor_type"
                label={t('form.ombor_type')}
                InputLabelProps={{ shrink: true }}
            >
                {Object.values(OmborType).map((type) => (
                    <MenuItem key={type} value={type}>
                        {t(`form.types.${type}`)}
                    </MenuItem>
                ))}
            </Field.Select>

            <Field.Text
                name="name"
                label={t('form.name')}
                InputLabelProps={{ shrink: true }}
                required
            />

            <Field.DatePicker
                name="date"
                label={t('form.date')}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        InputLabelProps: { shrink: true },
                    },
                }}
            />

            <Field.Select
                name="price_currency"
                label={t('form.price_currency')}
                InputLabelProps={{ shrink: true }}
            >
                {Object.values(PriceCurrency).map((currency) => (
                    <MenuItem key={currency} value={currency}>
                        {currency.toUpperCase()}
                    </MenuItem>
                ))}
            </Field.Select>

            <Field.Text
                name="description"
                label={t('form.description')}
                InputLabelProps={{ shrink: true }}
                multiline
                rows={2}
                sx={{ gridColumn: 'span 2' }}
            />
        </>
    );

    const renderPlyonkaFields = (
        <>
            <Field.Select
                name="plyonka_category"
                label={t('form.plyonka_category')}
                InputLabelProps={{ shrink: true }}
            >
                {Object.values(PlyonkaCategory).map((cat) => (
                    <MenuItem key={cat} value={cat}>
                        {cat.toUpperCase()}
                    </MenuItem>
                ))}
            </Field.Select>
            <Field.Text
                name="plyonka_subcategory"
                label={t('form.plyonka_subcategory')}
                InputLabelProps={{ shrink: true }}
            />
            <Field.Text
                name="thickness"
                label={t('form.thickness')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="width"
                label={t('form.width')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="total_kg"
                label={t('form.total_kg')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="price_per_kg"
                label={t('form.price_per_kg')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
        </>
    );

    const renderKraskaFields = (
        <>
            <Field.Text
                name="color_name"
                label={t('form.color_name')}
                InputLabelProps={{ shrink: true }}
            />
            <Field.Text
                name="color_hex"
                label={t('form.color_hex')}
                InputLabelProps={{ shrink: true }}
                type="color"
            />
            <Field.Text
                name="marka"
                label={t('form.marka')}
                InputLabelProps={{ shrink: true }}
            />
            <Field.Text
                name="barrels"
                label={t('form.barrels')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="total_kg"
                label={t('form.total_kg')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="price_per_kg"
                label={t('form.price_per_kg')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
        </>
    );

    const renderSilindrFields = (
        <>
            <Field.Text
                name="seriya_number"
                label={t('form.seriya_number')}
                InputLabelProps={{ shrink: true }}
            />
            <Field.Select
                name="origin"
                label={t('form.origin')}
                InputLabelProps={{ shrink: true }}
            >
                {Object.values(CylinderOrigin).map((origin) => (
                    <MenuItem key={origin} value={origin}>
                        {origin.toUpperCase()}
                    </MenuItem>
                ))}
            </Field.Select>
            <Field.Text
                name="length"
                label={t('form.length')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="diameter"
                label={t('form.diameter')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="quantity"
                label={t('form.quantity')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="price"
                label={t('form.price')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="usage_limit"
                label={t('form.usage_limit')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
        </>
    );

    const renderTayyorFields = (
        <>
            <Field.Text
                name="product_type"
                label={t('form.product_type')}
                InputLabelProps={{ shrink: true }}
            />
            <Field.Text
                name="quantity"
                label={t('form.quantity')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="net_weight"
                label={t('form.net_weight')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="gross_weight"
                label={t('form.gross_weight')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="total_net_weight"
                label={t('form.total_net_weight')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="total_gross_weight"
                label={t('form.total_gross_weight')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
        </>
    );

    const renderSolventFields = (
        <>
            <Field.Select
                name="solvent_type"
                label={t('form.solvent_type')}
                InputLabelProps={{ shrink: true }}
            >
                {Object.values(SolventType).map((type) => (
                    <MenuItem key={type} value={type}>
                        {type.toUpperCase()}
                    </MenuItem>
                ))}
            </Field.Select>
            <Field.Text
                name="total_liter"
                label={t('form.total_liter')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="price_per_liter"
                label={t('form.price_per_liter')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
        </>
    );

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
                    {renderCommonFields}

                    {currentType === OmborType.PLYONKA && renderPlyonkaFields}
                    {currentType === OmborType.KRASKA && renderKraskaFields}
                    {currentType === OmborType.SILINDIR && renderSilindrFields}
                    {(currentType === OmborType.TAYYOR_TOSHKENT || currentType === OmborType.TAYYOR_ANGREN) && renderTayyorFields}
                    {(currentType === OmborType.RASTVARITEL || currentType === OmborType.SUYUQ_KRASKA) && renderSolventFields}

                    {/* General fields for other types */}
                    {!([OmborType.PLYONKA, OmborType.KRASKA, OmborType.SILINDIR, OmborType.TAYYOR_TOSHKENT, OmborType.TAYYOR_ANGREN, OmborType.RASTVARITEL, OmborType.SUYUQ_KRASKA].includes(currentType as OmborType)) && (
                        <>
                            <Field.Text
                                name="quantity"
                                label={t('form.quantity')}
                                InputLabelProps={{ shrink: true }}
                                type="number"
                            />
                            <Field.Text
                                name="price"
                                label={t('form.price')}
                                InputLabelProps={{ shrink: true }}
                                type="number"
                            />
                        </>
                    )}
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" color="inherit" onClick={onCancel}>
                        {t('cancel')}
                    </Button>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        {isEdit ? t('update') : t('create')}
                    </LoadingButton>
                </Stack>
            </Stack>
        </Form>
    );
}
