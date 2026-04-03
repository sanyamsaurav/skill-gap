const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('OK'));
app.listen(5002, () => console.log('Listening 5002'));
