const fs = require('fs');
const { pipeline } = require('stream');
const { parser } = require('stream-json');
const { streamArray } = require('stream-json/streamers/StreamArray');

// Function to check if all keyword words are in the given string
function containsAllKeywords(string, keywords) {
    const stringWords = string.toLowerCase().split(' ');
    const keywordWords = keywords.toLowerCase().split(' ');

    return keywordWords.every(word => stringWords.includes(word));
}

// Function to process the JSON stream
function searchInStream(filePath, key, keywords) {
    return new Promise((resolve, reject) => {
        const results = [];

        const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
        const jsonParser = parser();
        const arrayStream = streamArray();

        arrayStream.on('data', ({ value }) => {
            if (containsAllKeywords(value[key], keywords)) {
                results.push(value);
            }
        });

        arrayStream.on('error', (err) => {
            reject('Error parsing JSON:', err);
        });

        arrayStream.on('end', () => {
            resolve(results);
        });

        pipeline(fileStream, jsonParser, arrayStream, (err) => {
            if (err) {
                reject('Pipeline error:', err);
            }
        });
    });
}

// Test the function
const filePath = './data/data.json'; // Replace with the path to your large JSON file
const key = 'product_title';
const keywords = 'hp laserjet';

searchInStream(filePath, key, keywords)
    .then((results) => {
        console.log('Matching objects:', results, results.length);
    })
    .catch((error) => {
        console.error(error);
    });
