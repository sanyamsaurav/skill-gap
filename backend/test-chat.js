const http = require('http');
const data = JSON.stringify({
  messages: [{role: 'user', content: 'hello'}],
  userId: '123'
});

const req = http.request({
  hostname: 'localhost',
  port: 5002,
  path: '/api/chat',
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
req.on('error', e => console.log('ERROR:', e.message));
req.write(data);
req.end();
