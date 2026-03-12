import fs from 'fs';
import axios from 'axios';
import * as xlsx from 'xlsx';

const EXCEL_FILE_PATH = '/Users/macbook/Downloads/Telegram Desktop/Наш склад остатки на 01.03.2026г..xlsx';

async function processExcel() {
    try {
        const token = fs.readFileSync('auth_token.txt', 'utf8').trim();
        if (!token) {
            console.error('No token found in auth_token.txt');
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const workbook = xlsx.readFile(EXCEL_FILE_PATH);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Read raw data ignoring header for a moment to see the structure
        const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        console.log('Total rows loaded:', rawData.length);
        if (rawData.length > 0) {
            console.log('Header row:', rawData[0]);
            console.log('First data row:', rawData[1]);
        }

        // Now process with keys
        const data = xlsx.utils.sheet_to_json(sheet);
        console.log(`\nFound ${data.length} records. Here is the first parsed record as json:`);
        console.log(JSON.stringify(data[0], null, 2));

        console.log('\nWill process them based on mapping...');

    } catch (error) {
        console.error('Error processing excel:', error.message);
    }
}

processExcel();
