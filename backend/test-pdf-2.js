const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function test() {
    try {
        console.log('PDFParse type:', typeof PDFParse);
        const parser = new PDFParse();
        console.log('Parser instance methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(parser)));
    } catch (err) {
        console.error('Error during PDFParse test:', err);
    }
}

test();
