const http = require('http');

http.get('http://localhost:8081/api/finances?payment_method=naqd', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(JSON.stringify(JSON.parse(data).slice(0, 5), null, 2)));
}).on('error', e => console.log('error', e.message));
