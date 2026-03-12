import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

const EXCEL_FILE_PATH = '/Users/macbook/Downloads/Telegram Desktop/Наш склад остатки на 01.03.2026г..xlsx';

async function testBackendParser() {
    try {
        const token = fs.readFileSync('auth_token.txt', 'utf8').trim();
        const form = new FormData();
        form.append('file', fs.createReadStream(EXCEL_FILE_PATH));

        console.log('Sending file to backend AI parser...');
        const res = await axios.post('https://polimax-backend-production.up.railway.app/ombor/plyonka/parse-sheet', form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${token}`
            }
        });

        console.log('Got response! Saving to result.json for inspection...');
        fs.writeFileSync('result.json', JSON.stringify(res.data, null, 2));

        console.log(`\nSession ID: ${res.data.session_id}`);
        console.log(`Total Rows: ${res.data.result.total_rows}`);
        console.log(`Valid Rows: ${res.data.result.valid_rows}`);
        console.log(`\nCheck result.json now!`);

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) console.error('Details:', JSON.stringify(error.response.data, null, 2));
    }
}

testBackendParser();
