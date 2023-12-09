require('dotenv').config();
const {Client} = require('pg');


const client = new Client({
  
  host: process.env.HOST,
  user: process.env.USER,
  port: process.env.DB_PORT,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});



client.connect();

// client.query(`Select * from users`,(err, res) => {
//     if(!err)
//     {
//         console.log(res.rows);

//     } else
//     {
//         console.log(err.message)
//     }
//     client.end;
// })
module.exports = {
  
  client
  
}