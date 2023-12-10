const {client} = require('../../Bootstrap/Db')
const {getPostData} = require('../../utils')
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

  // GET single user
// Route : /api/users/:id

async function getUser(req, res, id) {
  try {
    const query = 'SELECT * FROM users WHERE id = $1'; // Utilisation de paramètres pour éviter les injections SQL
    const result = await client.query(query, [id]);

    if (result.rows.length === 0) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Utilisateur introuvable' }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.rows[0])); // Envoi du premier utilisateur trouvé (s'il y en a)
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Erreur serveur');
  }
}


async function createUser(req, res) {
  try {
    const body = await getPostData(req);
    console.log('Corps de la requête POST :', body); // Afficher le corps de la requête pour le vérifier
    const { id, name, email, created_at, updated_at, password } = JSON.parse(body);

    const query = 'INSERT INTO users (id, name, email, created_at, updated_at, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [id, name, email, created_at, updated_at, password];

    const result = await client.query(query, values);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result.rows[0])); // Envoi du nouvel utilisateur créé
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Erreur serveur');
  }
}

// Update User
// Route :  PUT /api/users/:id

async function updateUser(req, res, id) {
  try {
    // Récupérer les données du corps de la requête
    const body = await getPostData(req);
    const { name, email, password } = JSON.parse(body);

    // Vérifier si l'utilisateur existe
    const queryFindUser = 'SELECT * FROM users WHERE id = $1';
    const resultFindUser = await client.query(queryFindUser, [id]);

    if (resultFindUser.rows.length === 0) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Utilisateur introuvable' }));
    } else {
      // Construire la requête de mise à jour
      const queryUpdateUser = `
        UPDATE users 
        SET 
          name = COALESCE($1, name),
          email = COALESCE($2, email),
          password = COALESCE($3, password)
        WHERE id = $4
        RETURNING *`;

      const values = [name, email, password, id];
      const resultUpdateUser = await client.query(queryUpdateUser, values);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(resultUpdateUser.rows[0])); // Renvoie l'utilisateur mis à jour
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Erreur serveur');
  }
}

// DELETE single user
// Route : DELETE /api/users/:id

async function deleteUser(req, res, id) {
  try {
    // Vérifier si l'utilisateur existe
    const queryFindUser = 'SELECT * FROM users WHERE id = $1';
    const resultFindUser = await client.query(queryFindUser, [id]);

    if (resultFindUser.rows.length === 0) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Utilisateur introuvable' }));
    } else {
      // Supprimer l'utilisateur
      const queryDeleteUser = 'DELETE FROM users WHERE id = $1';
      await client.query(queryDeleteUser, [id]);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `Utilisateur ${id} supprimé` }));
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Erreur serveur');
  }
}



  module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser

  }