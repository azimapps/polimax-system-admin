
import type { OmborItem, CreateOmborRequest } from 'src/types/ombor';

import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';

import { useGetClients } from 'src/hooks/use-clients';
import { useGetPartners } from 'src/hooks/use-partners';

import { useTranslate } from 'src/locales';
import { omborApi } from 'src/api/ombor-api';

import { Form, Field } from 'src/components/hook-form';

import { PartnerCategory } from 'src/types/partner';
import {
    OmborType,
    SolventType,
    PriceCurrency,
    CylinderOrigin,
    PlyonkaCategory,
} from 'src/types/ombor';

import { getOmborSchema } from './ombor-schema';

// ----------------------------------------------------------------------


type Props = {
    type: OmborType;
    item?: OmborItem;
    onSuccess?: () => void;
    onCancel?: () => void;
};

export function OmborForm({ type, item, onSuccess, onCancel }: Props) {
    const { t } = useTranslate('ombor');

    const activeType = item?.ombor_type || type;
    let partnerCategory: string | undefined = undefined;
    if (activeType === OmborType.PLYONKA) partnerCategory = PartnerCategory.PLYONKA;
    else if (activeType === OmborType.KRASKA || activeType === OmborType.SUYUQ_KRASKA) partnerCategory = PartnerCategory.BOYOQ;
    else if (activeType === OmborType.RASTVARITEL || activeType === OmborType.ARALASHMASI) partnerCategory = PartnerCategory.ERITUVCHI;
    else if (activeType === OmborType.SILINDIR) partnerCategory = PartnerCategory.SILINDR;
    else if (activeType === OmborType.KLEY) partnerCategory = PartnerCategory.YELIM;

    const { data: partners = [] } = useGetPartners(partnerCategory ? { category: partnerCategory } : undefined);
    const { data: clients = [] } = useGetClients();

    const isEdit = !!item;


    const defaultValues = useMemo(() => ({
        ombor_type: item?.ombor_type || type,
        name: item?.name || '',
        date: item?.date || new Date().toISOString(),
        description: item?.description || '',
        price_currency: item?.price_currency || PriceCurrency.USD,
        partner_id: item?.partner_id || null,
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
    }), [item, type]);


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
                await omborApi.updateOmborItem(data.ombor_type, item.id, data);
            } else {
                await omborApi.createOmborItem(data.ombor_type, data);
            }
            onSuccess?.();
            reset();
        } catch (error) {
            console.error(error);
        }
    });

    const renderCommonFields = (
        <>
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

        </>
    );


    const renderPlyonkaFields = (
        <>
            <Field.Select
                name="plyonka_category"
                label={t('form.plyonka_category')}
                InputLabelProps={{ shrink: true }}
                required
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
                required
            />
            <Field.Text
                name="price_per_kg"
                label={t('form.price_per_kg')}
                InputLabelProps={{ shrink: true }}
                type="number"
                required
            />
            <Field.Text
                name="seriya_number"
                label={t('form.seriya_number')}
                InputLabelProps={{ shrink: true }}
            />
            <Field.Select name="partner_id" label={t('form.supplier_id')} InputLabelProps={{ shrink: true }}>
                <MenuItem value="">None</MenuItem>
                {partners.map((partner) => (
                    <MenuItem key={partner.id} value={partner.id}>
                        {partner.fullname} {partner.company ? `(${partner.company})` : ''}
                    </MenuItem>
                ))}
            </Field.Select>

        </>
    );

    const renderKraskaFields = (
        <>
            <Field.Text
                name="color_name"
                label={t('form.color_name')}
                InputLabelProps={{ shrink: true }}
                required
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
                required
            />
            <Field.Text
                name="price_per_kg"
                label={t('form.price_per_kg')}
                InputLabelProps={{ shrink: true }}
                type="number"
                required
            />
            <Field.Text
                name="seriya_number"
                label={t('form.seriya_number')}
                InputLabelProps={{ shrink: true }}
            />
            <Field.Select name="partner_id" label={t('form.supplier_id')} InputLabelProps={{ shrink: true }}>
                <MenuItem value="">None</MenuItem>
                {partners.map((partner) => (
                    <MenuItem key={partner.id} value={partner.id}>
                        {partner.fullname} {partner.company ? `(${partner.company})` : ''}
                    </MenuItem>
                ))}
            </Field.Select>

        </>
    );

    const renderRastvaritelFields = (
        <>
            <Field.Select
                name="solvent_type"
                label={t('form.solvent_type')}
                InputLabelProps={{ shrink: true }}
                required
            >
                {Object.values(SolventType).map((option) => (
                    <MenuItem key={option} value={option}>
                        {option.toUpperCase()}
                    </MenuItem>
                ))}

            </Field.Select>
            <Field.Text
                name="total_liter"
                label={t('form.total_liter')}
                InputLabelProps={{ shrink: true }}
                type="number"
                required
            />
            <Field.Text
                name="price_per_liter"
                label={t('form.price_per_liter')}
                InputLabelProps={{ shrink: true }}
                type="number"
                required
            />
            <Field.Text
                name="seriya_number"
                label={t('form.seriya_number')}
                InputLabelProps={{ shrink: true }}
            />
            <Field.Select name="partner_id" label={t('form.supplier_id')} InputLabelProps={{ shrink: true }}>
                <MenuItem value="">None</MenuItem>
                {partners.map((partner) => (
                    <MenuItem key={partner.id} value={partner.id}>
                        {partner.fullname} {partner.company ? `(${partner.company})` : ''}
                    </MenuItem>
                ))}
            </Field.Select>

        </>
    );

    const renderAralashmasiFields = (
        <>
            <Field.Text
                name="total_liter"
                label={t('form.total_liter')}
                InputLabelProps={{ shrink: true }}
                type="number"
                required
            />
            <Field.Text
                name="total_kg"
                label={t('form.total_kg')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="price_per_liter"
                label={t('form.price_per_liter')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="price_per_kg"
                label={t('form.price_per_kg')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="eaf_component_id"
                label={t('form.eaf_component_id')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="eaf_component_quantity"
                label={t('form.eaf_component_quantity')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="etilin_component_id"
                label={t('form.etilin_component_id')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="etilin_component_quantity"
                label={t('form.etilin_component_quantity')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="metoksil_component_id"
                label={t('form.metoksil_component_id')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="metoksil_component_quantity"
                label={t('form.metoksil_component_quantity')}
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
                required
            />
            <Field.Select
                name="origin"
                label={t('form.origin')}
                InputLabelProps={{ shrink: true }}
                required
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
                required
            />
            <Field.Text
                name="price"
                label={t('form.price')}
                InputLabelProps={{ shrink: true }}
                type="number"
                required
            />
            <Field.Text
                name="usage"
                label={t('form.usage')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="usage_limit"
                label={t('form.usage_limit')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Select name="partner_id" label={t('form.supplier_id')} InputLabelProps={{ shrink: true }}>
                <MenuItem value="">None</MenuItem>
                {partners.map((partner) => (
                    <MenuItem key={partner.id} value={partner.id}>
                        {partner.fullname} {partner.company ? `(${partner.company})` : ''}
                    </MenuItem>
                ))}
            </Field.Select>

        </>
    );

    const renderKleyFields = (
        <>
            <Field.Text
                name="product_type"
                label={t('form.product_type')}
                InputLabelProps={{ shrink: true }}
                required
            />
            <Field.Text
                name="number_identifier"
                label={t('form.number_identifier')}
                InputLabelProps={{ shrink: true }}
                required
            />
            <Field.Text
                name="barrels"
                label={t('form.barrels')}
                InputLabelProps={{ shrink: true }}
                type="number"
                required
            />
            <Field.Text
                name="price"
                label={t('form.price')}
                InputLabelProps={{ shrink: true }}
                type="number"
                required
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
            <Field.Select name="partner_id" label={t('form.supplier_id')} InputLabelProps={{ shrink: true }}>
                <MenuItem value="">None</MenuItem>
                {partners.map((partner) => (
                    <MenuItem key={partner.id} value={partner.id}>
                        {partner.fullname} {partner.company ? `(${partner.company})` : ''}
                    </MenuItem>
                ))}
            </Field.Select>

        </>
    );

    const renderTayyorFields = (
        <>
            <Field.Text
                name="product_type"
                label={t('form.product_type')}
                InputLabelProps={{ shrink: true }}
                required
            />
            <Field.Select name="client_id" label={t('form.client_id')} InputLabelProps={{ shrink: true }} required>
                <MenuItem value="">None</MenuItem>
                {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                        {client.fullname} {client.company ? `(${client.company})` : ''}
                    </MenuItem>
                ))}
            </Field.Select>

            <Field.Text
                name="price"
                label={t('form.price')}
                InputLabelProps={{ shrink: true }}
                type="number"
            />
            <Field.Text
                name="number_identifier"
                label={t('form.number_identifier')}
                InputLabelProps={{ shrink: true }}
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
            <Field.Select name="partner_id" label={t('form.supplier_id')} InputLabelProps={{ shrink: true }}>
                <MenuItem value="">None</MenuItem>
                {partners.map((partner) => (
                    <MenuItem key={partner.id} value={partner.id}>
                        {partner.fullname} {partner.company ? `(${partner.company})` : ''}
                    </MenuItem>
                ))}
            </Field.Select>

        </>
    );

    const renderZapchastlarFields = (
        <>
            <Field.Text
                name="quantity"
                label={t('form.quantity')}
                InputLabelProps={{ shrink: true }}
                type="number"
                required
            />
            <Field.Text
                name="price"
                label={t('form.price')}
                InputLabelProps={{ shrink: true }}
                type="number"
                required
            />
        </>
    );

    const renderOtxotFields = (
        <>
            <Field.Text
                name="total_kg"
                label={t('form.total_kg')}
                InputLabelProps={{ shrink: true }}
                type="number"
                required
            />
            <Field.Text
                name="price_per_kg"
                label={t('form.price_per_kg')}
                InputLabelProps={{ shrink: true }}
                type="number"
                required
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
                    {(currentType === OmborType.KRASKA || currentType === OmborType.SUYUQ_KRASKA) && renderKraskaFields}
                    {currentType === OmborType.RASTVARITEL && renderRastvaritelFields}
                    {currentType === OmborType.ARALASHMASI && renderAralashmasiFields}
                    {currentType === OmborType.SILINDIR && renderSilindrFields}
                    {currentType === OmborType.KLEY && renderKleyFields}
                    {(currentType === OmborType.TAYYOR_TOSHKENT || currentType === OmborType.TAYYOR_ANGREN) && renderTayyorFields}
                    {currentType === OmborType.ZAPCHASTLAR && renderZapchastlarFields}
                    {currentType === OmborType.OTXOT && renderOtxotFields}

                    <Field.Text
                        name="description"
                        label={t('form.description')}
                        InputLabelProps={{ shrink: true }}
                        multiline
                        rows={2}
                        sx={{ gridColumn: 'span 2' }}
                    />
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
