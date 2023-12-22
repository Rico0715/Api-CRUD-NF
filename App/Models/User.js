const bcrypt = require('bcrypt');
const {client} = require('../../Bootstrap/Db')

async function getUsersQuery() {
  try {
    const query = 'SELECT * FROM users'; // Remplacez 'users' par le nom de votre table
    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs', error);
    throw error;
  }
}

async function getUserByIdQuery(id) {
    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const result = await client.query(query, [id]);
  
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur', error);
      throw error;
    }
  }

  async function createUserQuery(user) {
    try {
      const { id, name, email, created_at, updated_at, password } = user;

      const hashedPassword = await hashPassword(password);

      const query = 'INSERT INTO users (id, name, email, created_at, updated_at, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
      const values = [id, name, email, created_at, updated_at, hashedPassword];
  
      const result = await client.query(query, values);
  
      return result.rows[0];
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur', error);
      throw error;
    }
  }
  async function hashPassword(password) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.error('Erreur lors du cryptage du mot de passe', error);
      throw error;
    }
  }

  async function updateUserQuery(id, userData) {
    try {
      const { name, email, password } = userData;
  
      const queryFindUser = 'SELECT * FROM users WHERE id = $1';
      const resultFindUser = await client.query(queryFindUser, [id]);
  
      if (resultFindUser.rows.length === 0) {
        throw new Error('Utilisateur introuvable');
      }
  
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
  
      return resultUpdateUser.rows[0]; // Renvoie l'utilisateur mis à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
      throw error;
    }
  }

  async function deleteUserQuery(id) {
    try {
      const queryFindUser = 'SELECT * FROM users WHERE id = $1';
      const resultFindUser = await client.query(queryFindUser, [id]);
  
      if (resultFindUser.rows.length === 0) {
        throw new Error('Utilisateur introuvable');
      }
  
      const queryDeleteUser = 'DELETE FROM users WHERE id = $1';
      await client.query(queryDeleteUser, [id]);
  
      return { message: `Utilisateur ${id} supprimé` };
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur', error);
      throw error;
    }
  }

module.exports = { 
    getUsersQuery,
    getUserByIdQuery,
    createUserQuery,
    updateUserQuery,
    deleteUserQuery
 };