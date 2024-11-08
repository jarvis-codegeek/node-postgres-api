const { Pool } = require('pg');

// Database connection configuration
const client = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'newdb',
    password: 'root',
    port: 5432,
});

function cleanString(input) {
    // Remove special characters, pipelines, colons, parentheses, and brackets
    let cleaned = input.replace(/[^a-zA-Z0-9\s]|[:|(){}\[\]]/g, '');

    // Remove extra spaces
    cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();

    return cleaned;
}


// Function to search for matching keywords in any order
async function searchKeywords(keywords) {

    const createIndexQuery = ` CREATE INDEX IF NOT EXISTS idx_tsvector ON dummyschema.cpetable USING GIN (to_tsvector('english', product_title)); `; 
    
    await client.query(createIndexQuery);

    const query = `
        SELECT *
        FROM dummyschema.cpetable
        WHERE to_tsvector('english', product_title) @@ to_tsquery($1)
    `;

    const tsQuery = cleanString(keywords).split(' ').join(' & '); // Join keywords with '&' for full-text search

    try {
        const res = await client.query(query, [tsQuery]);
        console.log('Matching rows:', res.rows);
    } catch (err) {
        console.error('Error executing query:', err.stack);
    } finally {
        await client.end();
    }
}

// Example usage
const keywords = 'packetbeat';
searchKeywords(keywords);
