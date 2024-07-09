import express from 'express';
import { CustomRateLimiter } from './middlewares/customRateLimiter.middleware.js';
import rateLimit from 'express-rate-limit';
import requestIp from 'request-ip';

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 3,
    message: `try again after a minute`,
});

const app = express();
app.use(requestIp.mw());


// app.use("/service1", limiter)
app.get("/", (req, res) => {
    res.send("ok")
})

app.get("/service1", CustomRateLimiter(60, 3), (req, res) => {
    res.json({
        message: "service 123",
        data: {
            "this": "that",
            "etc": "apt"
        }

    })
})

app.listen(8000, () => {
    console.log("server running on port 80000")
})

