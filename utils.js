const { parse } = require('querystring');

function getPostData(req) {
    return new Promise((resolve, reject) => {
      try {
        let body = '';
  
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
  
        req.on('end', () => {
          resolve(body); // Renvoie directement la chaîne de caractères
        });
      } catch (error) {
        reject(error);
      }
    });
  }

module.exports ={
    getPostData
}