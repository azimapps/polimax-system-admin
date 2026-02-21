sed -i '' 's/supplier_id/partner_id/g' src/sections/ombor/ombor-form.tsx
sed -i '' "s/t('form.partner_id')/t('form.supplier_id')/g" src/sections/ombor/ombor-form.tsx
