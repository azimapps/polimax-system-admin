import fs from 'fs';
import axios from 'axios';
import pkg from 'xlsx';
const { readFile, utils } = pkg;

const EXCEL_FILE_PATH = '/Users/macbook/Downloads/Telegram Desktop/Наш склад остатки на 01.03.2026г..xlsx';

const partners = JSON.parse(fs.readFileSync('partners.json', 'utf8'));

function getPartnerId(name) {
    if (!name) return null;
    const cleanName = name.toString().toLowerCase().trim().replace(/['"«»]/g, '').replace(/[\(\)]/g, '');
    const partner = partners.find(p => {
        const pName = p.fullname.toLowerCase().trim().replace(/['"«»]/g, '').replace(/[\(\)]/g, '');
        const pComp = (p.company || '').toLowerCase().trim().replace(/['"«»]/g, '').replace(/[\(\)]/g, '');
        return pName === cleanName || pComp === cleanName || cleanName.includes(pName) || pName.includes(cleanName);
    });
    return partner ? partner.id : null;
}

let lastCategory = 'bopp';
let lastDate = new Date().toISOString();
let lastSupplierId = null;

function parsePlyonkaType(name) {
    if (!name) return { category: lastCategory, subcategory: '' };
    const n = name.toString().toLowerCase().trim();

    let category = null;
    if (n.includes('бопп')) category = 'bopp';
    else if (n.includes('спп') || n.includes('срр') || n.includes('cpp')) category = 'cpp';
    else if (n.includes('пэт') || n.includes('pet')) category = 'pet';
    else if (n.includes('пэ')) category = 'pe';
    else if (n.includes('твист')) category = 'tvist';

    if (category) lastCategory = category;
    else category = lastCategory;

    let subcategory = '';
    if (n.includes('жем.этикеточная') || n.includes('жем. этикеточная')) subcategory = 'jemchuk etiketochnaya';
    else if (n.includes('мет.жемчуг') || n.includes('мет. жемчуг')) subcategory = 'jemchuk metal';
    else if (n.includes('жемчуг')) subcategory = 'jemchuk';
    else if (n.includes('прозр') || n.includes('шаффоф') || n.includes('shaffof')) subcategory = 'prazrachniy';
    else if (n.includes('металл') || n.includes('metal')) subcategory = 'metal';
    else if (n.includes('белый') || n.includes('белая') || n.includes('beliy')) subcategory = 'beliy';
    else if (n.includes('матовая') || n.includes('matovaya')) subcategory = 'matovaya';

    return { category, subcategory };
}

function parseExcelDate(dateVal) {
    if (!dateVal || dateVal === 0 || dateVal === "0") return lastDate;

    let date;
    if (typeof dateVal === 'number') {
        if (dateVal < 10000) return lastDate;
        // Excel base date is 1899-12-30. Force to UTC midday.
        date = new Date(Math.round((dateVal - 25569) * 86400 * 1000));
        date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12, 0, 0));
    } else {
        const dStr = dateVal.toString().trim().replace(/,/g, '.');
        const parts = dStr.split('.');
        if (parts.length === 3) {
            let day = parseInt(parts[0]);
            let month = parseInt(parts[1]) - 1;
            let year = parseInt(parts[2]);
            if (year < 100) year += 2000;
            // Create in UTC at midday
            date = new Date(Date.UTC(year, month, day, 12, 0, 0));
        }
    }

    if (date && !isNaN(date.getTime()) && date.getUTCFullYear() > 2000) {
        lastDate = date.toISOString();
        return lastDate;
    }

    return lastDate;
}

async function startImport() {
    try {
        const token = fs.readFileSync('auth_token.txt', 'utf8').trim();
        const workbook = readFile(EXCEL_FILE_PATH);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawRows = utils.sheet_to_json(sheet, { header: 1 }).slice(2);

        console.log(`Starting CLEAN RE-IMPORT of ${rawRows.length} potential records...`);

        let success = 0;
        let failed = 0;

        for (const row of rawRows) {
            // Filter out empty rows or divider rows
            if (!row[0] && !row[8]) continue; // Skip completely empty
            if (row[0] && row[0].toString().includes('№')) continue; // Skip header repeats
            if (row[3] && row[3].toString().includes('Наименование')) continue;

            const { category, subcategory } = parsePlyonkaType(row[3]);
            const catPrefix = category ? category.toUpperCase() : '';
            const subPrefix = subcategory ? subcategory.toUpperCase() : '';
            const name = `${catPrefix} ${subPrefix}`.trim() || row[3] || 'Plyonka';

            const supplierId = getPartnerId(row[2]) || lastSupplierId;
            if (supplierId) lastSupplierId = supplierId;

            const payload = {
                name: name,
                date: parseExcelDate(row[1]),
                seriya_number: (row[0] === 0 || !row[0]) ? 'б/н' : row[0].toString(),
                supplier_id: supplierId,
                plyonka_category: category,
                plyonka_subcategory: subcategory,
                invoys: (row[4] === 0 || !row[4]) ? '' : row[4].toString(),
                width: parseFloat(row[5]?.toString()?.replace(',', '.')) || 0,
                thickness: parseFloat(row[6]?.toString()?.replace(',', '.')) || 0,
                rulon: parseInt(row[7]) || 0,
                total_kg: parseFloat(row[8]?.toString()?.replace(',', '.')) || 0,
                price_per_kg: 0,
                price_currency: 'usd',
                ombor_type: 'plyonka'
            };

            try {
                await axios.post('https://polimax-backend-production.up.railway.app/ombor/plyonka', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                success++;
                if (success % 50 === 0) console.log(`Successfully added ${success} items...`);
            } catch (err) {
                console.error(`Row ${success + failed + 1} Failed: ${payload.seriya_number} (${row[3]})`);
                // if (err.response) console.error('Error Details:', JSON.stringify(err.response.data, null, 2));
                failed++;
            }
        }

        console.log(`\nImport FINISHED.`);
        console.log(`Successfully added: ${success}`);
        console.log(`Failed to add: ${failed}`);

    } catch (error) {
        console.error('FATAL ERROR:', error.message);
    }
}

startImport();
