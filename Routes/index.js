const http = require('http')
const {getUsers, getUser, createUser, updateUser, deleteUser} = require ('../App/Controllers/UserController.js')

const server = http.createServer((req, res) => {
    if(req.url ==='/api/users' && req.method === 'GET')
    {
        getUsers(req, res)
    }
        else if(req.url.match(/\/api\/users\/([a-z0-9]+)/) && req.method === 'GET') 
    {
        const id = req.url.split('/')[3]
        getUser(req, res, id)
    }else if (req.url === '/api/users' && req.method === 'POST')
    {
        createUser(req, res);
    }else if(req.url.match(/\/api\/users\/([a-z0-9]+)/) && req.method === 'PUT') 
    {
        const id = req.url.split('/')[3]
        updateUser(req, res, id)
    }else if(req.url.match(/\/api\/users\/([a-z0-9]+)/) && req.method === 'DELETE') 
    {
        const id = req.url.split('/')[3]
        deleteUser(req, res, id)
    } else {
        res.writeHead(404,{'Content-Type': 'application/json' })
        res.end(JSON.stringify({message : 'Route inconnu'}))
    }
})

const PORT = process.env.PORT || 8889;

server.listen(PORT, () => console.log(`Serveur sur le port : ${PORT}`))