const Pool = require('pg').Pool;

const client = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'newdb',
  password: 'root',
  port: 5432,
});




const findCveId = async () => {
    let res = await client.query('select cpe_info from dummyschema.cpetable')

    console.log('rows', res.rows)

    res.rows.forEach((row) => {

        

    })

}

findCveId()






const getAllCVE = () => {
    
}
