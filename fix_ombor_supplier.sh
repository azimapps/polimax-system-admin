sed -i '' 's/partner_id/supplier_id/g' src/types/ombor.ts
sed -i '' 's/partner_id/supplier_id/g' src/sections/ombor/ombor-schema.ts
sed -i '' 's/partner_id: z.number/supplier_id: z.number/g' src/sections/ombor/ombor-schema.ts
sed -i '' 's/partner_id: item?.partner_id/supplier_id: item?.supplier_id/g' src/sections/ombor/ombor-form.tsx
sed -i '' 's/name="partner_id"/name="supplier_id"/g' src/sections/ombor/ombor-form.tsx
sed -i '' 's/partner_id?: number;/supplier_id?: number;/g' src/api/ombor-api.ts
sed -i '' 's/partner_id?: number;/supplier_id?: number;/g' src/hooks/use-ombor.ts
