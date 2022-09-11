import express from 'express'
import http from 'http'
import { print } from 'listening-on'
import { env } from './env'
import SocketIO from 'socket.io'

// Routes
import { memoRoutes } from './routes/memo'
import { userRoutes } from  './routes/user'
 
//Setup 
const app = express();
const server = new http.Server(app);
const io = new SocketIO.Server(server);

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//middleware
app.use((req, res, next) => {
    console.log(req.method, req.url)
    next()
})

app.use(express.static('public'))

//user router
app.use(memoRoutes(io))
app.use(userRoutes)

io.on('connection', function(socket) {
    console.log('socket connected: ' +socket.id);

    socket.on('memos', (memos)=>{
        io.emit('memos', memos)
    })
});

// start server
server.listen(env.PORT, () => {
    print(env.PORT)
})

