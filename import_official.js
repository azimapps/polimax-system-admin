import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

const EXCEL_FILE_PATH = '/Users/macbook/Downloads/Telegram Desktop/Наш склад остатки на 01.03.2026г..xlsx';

async function importViaBackend() {
    try {
        const token = fs.readFileSync('auth_token.txt', 'utf8').trim();
        const form = new FormData();
        form.append('file', fs.createReadStream(EXCEL_FILE_PATH));

        console.log('Step 1: Uploading to backend parser...');
        const parseRes = await axios.post('https://polimax-backend-production.up.railway.app/ombor/plyonka/parse-sheet', form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${token}`
            }
        });

        const { session_id, result } = parseRes.data;
        console.log(`\nSession ID: ${session_id}`);
        console.log(`Total Rows: ${result.total_rows}`);
        console.log(`Valid Rows: ${result.valid_rows}`);
        console.log(`Preview of first item:`, JSON.stringify(result.items[0], null, 2));

        if (result.valid_rows > 0) {
            console.log('\nStep 2: Committing import...');
            const importRes = await axios.post(`https://polimax-backend-production.up.railway.app/ombor/plyonka/parse-sheet/${session_id}/import`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`\nImport Success!`, importRes.data);
        } else {
            console.error('\nError: No valid rows found by AI parser.');
        }

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) console.error('Details:', JSON.stringify(error.response.data, null, 2));
    }
}

importViaBackend();
