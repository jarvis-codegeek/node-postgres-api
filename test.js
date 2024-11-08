const express = require('express');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Define the path to the output CSV file
const csvFilePath = path.join(__dirname, 'output.csv');

// Create a CSV writer
const csvWriter = createObjectCsvWriter({
    path: csvFilePath,
    header: [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Name' },
        { id: 'age', title: 'Age' },
    ]
});

// Sample large JSON data
const jsonData = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
    { id: 3, name: 'Charlie', age: 35 },
    // Add more objects as needed
];

// Function to write JSON data to CSV
async function writeJsonToCsv(data) {
    try {
        await csvWriter.writeRecords(data);
        console.log('CSV file written successfully.');
    } catch (err) {
        console.error('Error writing CSV file:', err);
    }
}

// Endpoint to generate the CSV file
app.get('/generate-csv', async (req, res) => {
    await writeJsonToCsv(jsonData);
    res.send('CSV file has been generated successfully.');
});

// Endpoint to download the CSV file
app.get('/download-csv', (req, res) => {
    res.download(csvFilePath, 'output.csv', (err) => {
        if (err) {
            console.error('Error downloading the file:', err);
        }
    });
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
