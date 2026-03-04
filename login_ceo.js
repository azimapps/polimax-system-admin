import axios from 'axios';

async function login() {
    try {
        const response = await axios.post('https://polimax-backend-production.up.railway.app/auth/login', {
            login: 'ceo',
            password: 'ccc'
        });
        console.log('Login successful!');
        console.log('Token:', response.data.token);
        console.log('Account Details:', response.data.account);
    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
    }
}

login();
