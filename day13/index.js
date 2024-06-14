import express from "express";
import cors from 'cors';
import { Server as ioServer } from 'socket.io';


const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(requestIp.mw())


app.get("/ping", (req, res) => {
    res.send("pong")
})

app.get("/active", (req, res) => {
    res.json(activeUsers);
})

const server = app.listen(8000, () => {
    console.log("server running on port 8000")
})

const io = new ioServer(server, {
    cors: {
        "origin": "*"
    }
})

let activeUsers = {}

io.on('connection', (socket) => {
    const address = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address

    console.log(`user ${socket.id} connected  with ip:${address}`);

    // Add the user to the active users list
    activeUsers[socket.id] = { ip: address }

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        delete activeUsers[socket.id]
    });
});
