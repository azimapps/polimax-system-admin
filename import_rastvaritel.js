import fs from 'fs';
import axios from 'axios';
import pkg from 'xlsx';
const { readFile, utils } = pkg;

const EXCEL_FILE_PATH = '/Users/macbook/Downloads/Telegram Desktop/Аралашма март.xlsx';

const partners = {
    'Шавкатхожи': 82,
    'Раимбов': 84,
    'Хусниддин': 86,
    'Shtu solvents': null
};

const solventTypes = {
    'Метокси': 'metoksil',
    'ЭАФ': 'eaf',
    'ЭТИЛ': 'ea'
};

async function importRastvaritel() {
    try {
        const token = fs.readFileSync('auth_token.txt', 'utf8').trim();
        const workbook = readFile(EXCEL_FILE_PATH);
        const sheet = workbook.Sheets['Итого'];
        const data = utils.sheet_to_json(sheet, { header: 1 });

        // Skip headers (Rows 1-2)
        const rows = data.slice(2);
        let importedCount = 0;

        for (const row of rows) {
            const seriya = row[1]; // №6109
            const dateStr = row[2]; // 13,11,2025
            const supplierName = row[3]; // Шавкатхожи
            const name = row[4]; // Метокси
            const totalLiter = row[9]; // 595

            if (!name || !totalLiter) continue;

            // Parse Date
            let date = new Date(Date.UTC(2026, 2, 4, 12, 0, 0)); // Default to today
            if (dateStr && typeof dateStr === 'string') {
                const parts = dateStr.split(',');
                if (parts.length === 3) {
                    date = new Date(Date.UTC(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]), 12, 0, 0));
                }
            }

            const payload = {
                name: name,
                date: date.toISOString(),
                total_liter: parseFloat(totalLiter),
                price_per_liter: 0, // No price in this sheet
                price_currency: 'usd',
                solvent_type: solventTypes[name] || 'eaf',
                supplier_id: partners[supplierName] || null,
                seriya_number: seriya ? seriya.toString() : null,
                description: `Imported from ${EXCEL_FILE_PATH}`
            };

            await axios.post('https://polimax-backend-production.up.railway.app/ombor/rastvaritel', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log(`Imported: ${name} (${totalLiter} L)`);
            importedCount++;
        }

        console.log(`Import complete! Total items added: ${importedCount}`);
    } catch (error) {
        console.error('Import failed:', error.response?.data || error.message);
    }
}

importRastvaritel();
