const Excel = require('exceljs');
const fs = require('fs');
const stream = require('stream');

const workbook = new Excel.Workbook();
const worksheet = workbook.addWorksheet('Sheet1');
worksheet.columns = [
    { header: 'Id', key: 'id' },
    { header: 'Name', key: 'name' },
    { header: 'Age', key: 'age' },
];

// Create a readable stream from a large array of objects
const data = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
    // Add more objects as needed
];

const readableStream = new stream.Readable({
    objectMode: true,
    read() {}
});

readableStream.push(data);
readableStream.push(null);

// Create a writable stream to write data to Excel
const writableStream = worksheet.createStream({ pageBreak: true });
writableStream.on('error', (err) => {
    console.error('Error writing to Excel:', err);
});
writableStream.on('end', () => {
    console.log('Data written to Excel successfully.');
});

// Pipe the readable stream to the writable stream
readableStream.pipe(writableStream);

// Save the workbook to a file
workbook.xlsx.writeFile('example.xlsx')
    .then(() => {
        console.log('Workbook saved successfully.');
    })
    .catch((err) => {
        console.error('Error saving workbook:', err);
    });
