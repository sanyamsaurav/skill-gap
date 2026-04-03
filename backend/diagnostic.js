const express = require('express');
const app = express();
const port = 5002;

console.log('--- DIAGNOSTIC START ---');
try {
    app.get('/health', (req, res) => res.send('OK'));
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
} catch (err) {
    console.error('FAILED TO START:', err);
}
