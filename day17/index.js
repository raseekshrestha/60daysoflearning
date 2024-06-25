
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { configDotenv } from 'dotenv';
import { Server } from 'socket.io';

import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.routes.js';
import messageRoutes from './routes/message.routes.js';


configDotenv()



const app = express();
app.use(cors());
app.use(express.json());



connectDB()

app.get("/", (req, res) => {
    res.send("welsome my world chat app")
})

app.use("/api/user", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// error handlers
app.use(notFound)
app.use(errorHandler)


const server = app.listen(8000, () => {
    console.log("server running on port 8000")
})




const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*"
    }
})



io.on("connection", (socket) => {
    console.log("connected to socket.io", socket.id)
    // console.log(socket)
    socket.on("setup", (userData) => {
        socket.join(userData._id)
        socket.emit("connected")
        console.log(userData?._id)
    })

    socket.on("join_chat", (roomId) => {
        socket.join(roomId);
        console.log("joining roomId", roomId)
    })

    socket.on("newMessage", (newMessage) => {
        console.log("got new message from ", newMessage.sender.username)
        console.log("and it says: ", newMessage.content)
        // console.log(newMessage)

        const chat = newMessage.chat;
        if (!chat.users) return console.log("chat.users not defined")

        chat.users.forEach(user => {
            if (newMessage.sender._id !== user._id) {
                console.log(`sending to ${user.username}`)
                socket.in(user._id).emit("receivedMessage", newMessage)
            }
        })
    })

    socket.on("typing", (room) => {
        console.log("typinhg")
        socket.in(room).emit('typing');
    })
    socket.on("stopTyping", (room) => {
        console.log("stopped typing")
        socket.in(room).emit("stoppedTyping");

    })

    socket.on("disconnect", (reason) => {
        console.log("one of the client disconnected")
    })
})