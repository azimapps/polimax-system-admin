
import { z } from 'zod';

import { OmborType, PriceCurrency, SolventType, CylinderOrigin, PlyonkaCategory } from 'src/types/ombor';

export const getOmborSchema = (t: any) =>
    z.object({
        ombor_type: z.nativeEnum(OmborType),
        name: z.string().min(1, { message: t('required') }),
        date: z.string().min(1, { message: t('required') }),
        description: z.string().optional(),
        price_currency: z.nativeEnum(PriceCurrency),
        supplier_id: z.number().optional().nullable(),
        client_id: z.number().optional().nullable(),

        // Plyonka specific
        plyonka_category: z.nativeEnum(PlyonkaCategory).optional().nullable(),
        plyonka_subcategory: z.string().optional().nullable(),
        thickness: z.number().optional().nullable(),
        width: z.number().optional().nullable(),

        // Kraska specific
        barrels: z.number().optional().nullable(),
        color_name: z.string().optional().nullable(),
        color_hex: z.string().optional().nullable(),
        marka: z.string().optional().nullable(),

        // Totals/Quantities
        total_kg: z.number().optional().nullable(),
        total_liter: z.number().optional().nullable(),
        quantity: z.number().optional().nullable(),

        // Prices
        price_per_kg: z.number().optional().nullable(),
        price_per_liter: z.number().optional().nullable(),
        price: z.number().optional().nullable(),

        // Silindr specific
        seriya_number: z.string().optional().nullable(),
        origin: z.nativeEnum(CylinderOrigin).optional().nullable(),
        length: z.number().optional().nullable(),
        diameter: z.number().optional().nullable(),
        usage: z.number().optional().nullable(),
        usage_limit: z.number().optional().nullable(),

        // Solvent specific
        solvent_type: z.nativeEnum(SolventType).optional().nullable(),

        // Tayyor mahsulot specific
        product_type: z.string().optional().nullable(),
        net_weight: z.number().optional().nullable(),
        gross_weight: z.number().optional().nullable(),
        total_net_weight: z.number().optional().nullable(),
        total_gross_weight: z.number().optional().nullable(),
    });
