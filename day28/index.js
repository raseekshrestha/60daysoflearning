
import cluster from 'cluster';
import os from 'os';
import express from 'express';
import status from 'express-status-monitor';

const totalCpus = os.cpus().length
const cpus = os.cpus();
const mem = os.freemem() / (1024 * 1024 * 1024);
const total = os.totalmem() / (1024 ** 3);




if (cluster.isPrimary) {
    console.log(`primary process: ${process.pid}`)
    for (let i = 0; i < totalCpus; i++) {
        // console.log("forking ...")
        cluster.fork()
    }
} else {
    const app = express();
    app.use(status())
    app.get("/", (req, res) => {
        return res.json({ data: `hello from server: ${process.pid}`, cpus: cpus.length, freeMem: mem, totalMem: total })

    })

    app.listen(8000, () => {
        console.log(`server running on port 8000: pid:${process.pid}`)
    })
}
