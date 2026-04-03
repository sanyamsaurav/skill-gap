const pdfParse = require('pdf-parse');
console.log('Type of pdfParse:', typeof pdfParse);
console.log('Keys of pdfParse:', Object.keys(pdfParse));
if (typeof pdfParse === 'function') {
    console.log('It is a function');
} else if (pdfParse.default && typeof pdfParse.default === 'function') {
    console.log('It has a default function');
} else if (pdfParse.pdfParse && typeof pdfParse.pdfParse === 'function') {
    console.log('It has a pdfParse function');
}
