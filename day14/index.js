import express from 'express';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { Server } from 'socket.io';
import cors from 'cors';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const activeLive = []

const app = express();
app.use(cors())


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})



const server = app.listen(8000, () => {
    console.log("server running on port 8000")
})

const endLive = (writeStream, socket) => {
    if (writeStream) {
        writeStream.end()
        writeStream = null;

    }
}

const io = new Server(server);

io.on('connection', (socket) => {
    console.log("Socket Connected", socket.id)

    let writeStream;

    // stream START
    socket.on('streamStart', () => {
        console.log("Stream Started")
        writeStream = fs.createWriteStream(`${socket.id}.mp4`, { flags: 'a' })
    })

    // STREAMING
    socket.on("stream", (stream) => {
        if (writeStream) {
            writeStream.write(stream)

        }
    })

    // STREAM END
    socket.on('streamEnd', () => {
        console.log("Stream Stopped")
        writeStream.end();
    })


    socket.on("disconnect", () => {
        console.log("socket disconnected")
        // end live if user disconnects without emitting streamEnd
        endLive(writeStream, socket)

    })
})
