const { Pool } = require('pg');
const fs = require('fs');

// Database connection configuration
const client = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'newdb',
    password: 'root',
    port: 5432,
});

// Read JSON file
const data = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));

// Connect to PostgreSQL
let count = 1
// Function to insert data into the database
async function insertData(data) {
    const query = 'INSERT INTO dummyschema.cpetable(product_name, cpe_info) VALUES($1, $2)';

    for (const item of data) {
        await client.query(query, [item.product_title, item.cpeName]);
        console.log('Inserted', count);
        count++
    }

    console.log('Data inserted successfully');
}

// Call the function to insert data
insertData(data)
    .then(() => client.end())
    .catch(err => console.error('Error inserting data:', err.stack));
