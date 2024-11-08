const { Pool } = require('pg');

// Database connection configuration
const client = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'newdb',
    password: 'root',
    port: 5432,
});

// Function to search for matching keywords in any order
async function searchKeywords(keywords) {
    
    const query = `
        SELECT *
        FROM dummyschema.cpetable
        WHERE to_tsvector('english', product_name) @@ to_tsquery($1)
    `;

    const tsQuery = keywords.split(' ').join(' & '); // Join keywords with '&' for full-text search

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
