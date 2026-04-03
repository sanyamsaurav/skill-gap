const http = require('http');

const data = JSON.stringify({
  name: 'Real User',
  email: `real${Date.now()}@test.com`,
  password: 'realpassword'
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
  res.on('end', () => console.log('STATUS:', res.statusCode, 'BODY:', body));
});

req.on('error', e => console.error('ERROR:', e.message));
req.write(data);
req.end();
