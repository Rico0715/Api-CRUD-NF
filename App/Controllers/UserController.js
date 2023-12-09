const {client} = require('../../Bootstrap/Db')

// GET all user
// Route : GET /api/users

async function getUsers(req, res) {
    try {
      const query = 'SELECT * FROM users'; // Remplacez 'users' par le nom de votre table
  
      const result = await client.query(query);
  
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.rows));
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Erreur serveur');
    }
  }

  module.exports = {
    getUsers
  }