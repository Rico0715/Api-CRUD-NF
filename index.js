// index.js

const http = require('http');
const app = require('./Routes/index');

const PORT = process.env.PORT || 8889;

const server = http.createServer(app);

server.listen(PORT, () => console.log(`Serveur sur le port : ${PORT}`));
