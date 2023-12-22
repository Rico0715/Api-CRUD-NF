const {client} = require('../../Bootstrap/Db')
const {getPostData} = require('../../utils')
const { getUsersQuery, getUserByIdQuery, createUserQuery, updateUserQuery, deleteUserQuery } = require('../Models/User')
// GET all user
// Route : GET /api/users

async function getUsers(req, res) {
    try {
      const users = await getUsersQuery();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
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
    const users = await getUserByIdQuery(id);

    if (users.length === 0) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Utilisateur introuvable' }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users[0])); // Envoi du premier utilisateur trouvé (s'il y en a)
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

    const newUser = {
      id,
      name,
      email,
      created_at,
      updated_at,
      password
    };

    const createdUser = await createUserQuery(newUser);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(createdUser)); // Envoi du nouvel utilisateur créé
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
    const body = await getPostData(req);
    const { name, email, password } = JSON.parse(body);

    const userData = {
      name,
      email,
      password
    };

    const updatedUser = await updateUserQuery(id, userData);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updatedUser)); // Renvoie l'utilisateur mis à jour
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
    const result = await deleteUserQuery(id);

    res.writeHead(204, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result)); // Renvoie un message indiquant la suppression de l'utilisateur
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