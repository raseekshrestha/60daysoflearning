import express from 'express';
import client from 'prom-client';
import responseTime from 'response-time';

// loggin
import { createLogger, transports } from "winston";
import LokiTransport from "winston-loki";
const options = {
    transports: [
        new LokiTransport({
            labels: {
                appName: "express monitor"
            },
            host: "http://127.0.0.1:3100"
        })
    ]
};
const logger = createLogger(options);

const app = express();

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({
    register: client.register
})

// custom metrics
const reqResTime = new client.Histogram({
    name: "http_express_req_res_time",
    help: "indicate request and respose time",
    labelNames: ['method', "route", "statusCode"],
    buckets: [1, 50, 100, 200, 500, 800, 1000, 2000]
})

const totalRequest = new client.Counter({
    name: "total_request_counter",
    help: "show total request"
})

app.use(responseTime((req, res, time) => {
    totalRequest.inc()
    reqResTime.labels({
        method: req.method,
        route: req.url,
        statusCode: res.statusCode
    }).observe(time)
}))

app.get("/", (req, res) => {
    logger.info("GET on /")
    res.json({
        message: "success",
        data: [1, 2, 3, 4, 5]
    })
})

const random = (thelist) => {
    const index = Math.floor(Math.random() * thelist.length)
    return thelist[index]
}

const doTask = async (req, res) => {
    const timeTaken = random([200, 400, 600, 900, 1500, 2000])
    const throwErr = random([1, 5, 6, 7, 8, 9]) == 7;
    if (throwErr) {
        const randomErr = random([
            'payment failed',
            'database Err',
            'take this error',
            'temperature error'
        ])
        throw new Error(randomErr)
    } else {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(timeTaken)
            }, timeTaken)
        })
    }



}


app.get("/something", async (req, res) => {
    try {
        const response = await doTask();
        logger.info("doTask job successful")
        res.json({ status: "ok", message: `some task done in ${response} ms` })
    } catch (err) {
        logger.error(err.message)
        res.status(500).json({
            status: "failed",
            message: err.message || "something went wrong"
        })
    }



})


app.get("/metrics", async (req, res) => {
    res.setHeader("Content-Type", client.register.contentType)
    const metrics = await client.register.metrics();
    res.send(metrics)
})


app.listen(8000, (req, res) => {
    console.log("server running on port 8000")
})