const http = require('http');
const fs = require('fs');

const data = JSON.stringify({
  name: 'Testy',
  email: `test${Date.now()}@test.com`,
  password: 'password'
});

const req = http.request({
  hostname: 'localhost',
  port: 5002,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
     fs.writeFileSync('fetch-result.json', JSON.stringify({ status: res.statusCode, body: body }));
  });
});

req.on('error', e => fs.writeFileSync('fetch-result.json', JSON.stringify({ error: e.message })));
req.write(data);
req.end();
