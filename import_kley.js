import fs from 'fs';
import axios from 'axios';
import pkg from 'xlsx';
const { readFile, utils } = pkg;

const EXCEL_FILE_PATH = '/Users/macbook/Downloads/Telegram Desktop/КЛЕЙ март.xlsx';

const partners = {
    'Турецкий': 73,
    'PERSIACHASB': 75,
    'Омад Назаров': 77,
    'OCHEM  China': 79,
    'OCHEM China': 79,
    'BCI  Туркия': 81,
    'BCI Туркия': 81,
    'Бегзод Тошкент': 83,
    'Дамир  ака ': 85,
    'Damir aka': 85
};

async function importKley() {
    try {
        const token = fs.readFileSync('auth_token.txt', 'utf8').trim();
        const workbook = readFile(EXCEL_FILE_PATH);
        const sheet = workbook.Sheets['Итого'];
        const data = utils.sheet_to_json(sheet, { header: 1 });

        const rows = data.slice(1).filter(r => r && r[4] !== undefined && r[4] !== null && r[4] !== 0);
        let importedCount = 0;

        for (const row of rows) {
            const parti = row[1]; // "№2847"
            const dateStr = row[2]; // "06,01,2021"
            let supplierName = row[3]; // "Турецкий"
            const category = row[4]; // "ECOLAD"
            const subCategory = row[5]; // "СSL-48"
            const barrelsStr = row[8]; // 2
            const totalWeighStr = row[9]; // 60

            if (!category || typeof category !== 'string' || barrelsStr === undefined) continue;

            // Skip 'Наименование' header row
            if (category === 'Наименование') continue;

            const name = subCategory ? `${category} ${subCategory}`.trim() : category;

            if (supplierName && typeof supplierName === 'string') {
                supplierName = supplierName.trim();
            }

            // Parse Date
            let date = new Date(Date.UTC(2026, 2, 4, 12, 0, 0));
            if (dateStr && typeof dateStr === 'string') {
                const parts = dateStr.split(',');
                if (parts.length === 3) {
                    date = new Date(Date.UTC(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]), 12, 0, 0));
                }
            }

            const barrels = parseInt(barrelsStr) || 0;
            const totalKg = parseFloat(totalWeighStr) || 0;
            const netWeight = barrels > 0 ? parseFloat((totalKg / barrels).toFixed(2)) : 0;

            let pId = partners[supplierName] || null;

            const payload = {
                name: name,
                date: date.toISOString(),
                barrels: barrels,
                product_type: category.toString().toLowerCase() || 'kley',
                number_identifier: parti ? parti.toString() : 'KL-000',
                supplier_id: pId,
                net_weight: netWeight,
                total_net_weight: totalKg,
                price_currency: 'usd',
                description: 'Imported'
            };

            await axios.post('https://polimax-backend-production.up.railway.app/ombor/kley', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log(`Imported Kley: ${name} (${barrels} barrels, ${totalKg} kg)`);
            importedCount++;
        }

        console.log(`Import complete! Total items added: ${importedCount}`);
    } catch (error) {
        console.error('Import failed:', error.response?.data || error.message);
    }
}

importKley();
