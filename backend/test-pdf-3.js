const pdf = require('pdf-parse');
const fs = require('powershell'); // Not used, just placeholder

async function test() {
    console.log('Keys of require("pdf-parse"):', Object.keys(pdf));
    // Try to find the function that actually parses.
}
test();
