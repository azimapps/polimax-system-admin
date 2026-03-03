const axios = require('axios');

const token = process.argv[2];
if (!token) {
    console.error('❌ Error: Please provide your login token as an argument.');
    console.log('Usage: node add_partners.js "YOUR_TOKEN_HERE"');
    process.exit(1);
}

const baseURL = 'https://polimax-backend-production.up.railway.app';

const companies = [
    "Биаксплен",
    "ООО ORIENT FACTORY",
    "Mega Lux Sirdaryo (ООО Invest Asia)",
    "Mega Lux Sirdaryo",
    "ЭШУ Феруза",
    "Polilux",
    "Дим Реал Принт",
    "Россия",
    "Super Film",
    "Cold West Technology",
    "МБФ",
    "Синопласт",
    "Элбек пласт",
    "Улуг Саман",
    "Чортог",
    "Асрор-Рустам",
    "Бриз",
    "FLEX FILMS LLC",
    "Pakem",
    "Реталл Россия",
    "FLEX MIDDLE EAST FZE",
    "Титан плюс",
    "Савдо ЗТЮ",
    "Servis savdo",
    "Polupack",
    "Аккорд",
    "Турбо пласт плюс",
    "Фиббер",
    "Ташкент",
    "Китай упаковщик",
    "Uz Pro Labeloo",
    "SUQIAN GETTEL",
    "ООО \"Флекс Филмс Рус\"",
    "Shenjen Guangyuanjie Alufoil Products Co., Ltd"
];

async function addPartners() {
    console.log(`⏳ Starting to add ${companies.length} partners...`);

    for (const company of companies) {
        const randNum = Math.floor(1000000 + Math.random() * 9000000);
        const phoneNumber = `+998 90 ${String(randNum).substring(0,3)} ${String(randNum).substring(3,5)} ${String(randNum).substring(5,7)}`;
        
        const payload = {
            fullname: `Rep of ${company.substring(0, 15)}`,
            company: company,
            phone_number: phoneNumber,
            categories: ['plyonka', 'boyoq', 'erituvchi', 'silindr', 'yelim'],
            notes: "Automatically added supplier"
        };

        try {
            await axios.post(`${baseURL}/partners`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(`✅ Added: ${company}`);
        } catch (error) {
            console.error(`❌ Failed: ${company}`, error.response?.data || error.message);
        }
    }

    console.log("\n🎉 Done! All partners have been processed.");
}

addPartners();
