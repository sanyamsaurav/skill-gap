const http = require('http');
const fs = require('fs');

const data = JSON.stringify({
  name: 'Verification Bot',
  email: `bot${Date.now()}@test.com`,
  password: 'password123'
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
  res.on('data', d => body += d);
  res.on('end', () => fs.writeFileSync('final.json', JSON.stringify({ status: res.statusCode, body })));
});

req.on('error', e => fs.writeFileSync('final.json', JSON.stringify({ error: e.message })));
req.write(data);
req.end();
