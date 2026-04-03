const http = require('http');

const data = JSON.stringify({
  name: 'Testy',
  email: `test${Date.now()}@test.com`,
  password: 'password'
});

const options = {
  hostname: 'localhost',
  port: 5002,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let resData = '';
  res.on('data', d => resData += d);
  res.on('end', () => console.log('STATUS:', res.statusCode, 'BODY:', resData));
});

req.on('error', error => {
  console.error('ERROR:', error);
});

req.write(data);
req.end();
