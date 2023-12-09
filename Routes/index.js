const http = require('http')
const {getUsers} = require ('../App/Controllers/UserController.js')

const server = http.createServer((req, res) => {
    if(req.url ==='/api/users' && req.method === 'GET'){
        getUsers(req, res)}
})

const PORT = process.env.PORT || 8889;

server.listen(PORT, () => console.log(`Serveur sur le port : ${PORT}`))