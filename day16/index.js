import express from 'express';
import fs, { stat } from 'fs';
import status from 'express-status-monitor'
import zlib from 'zlib';

const app = express();
app.use(status())


app.get("/", (req, res) => {
    // const data = fs.readFileSync("big.txt", 'utf-8')
    // res.send(data)

    // using stream to send data
    const stream = fs.createReadStream("big.txt", "utf-8")
    stream.on("data", (chunk) => res.write(chunk))
    stream.on("end", () => res.end())
})

app.get("/zip", (req, res) => {
    fs.createReadStream("big.txt").pipe(zlib.createGzip().pipe(fs.createWriteStream("big.zip")))
    res.send("zipped")
})

app.listen(8000);



