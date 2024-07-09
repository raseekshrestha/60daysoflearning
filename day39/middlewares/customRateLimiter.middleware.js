
import { Redis } from 'ioredis';

const client = new Redis()


const CustomRateLimiter = (timePeriod, maxReq) => async (req, res, next) => {
    const numRequests = await client.incr(req.clientIp)
    if (numRequests == 1) {
        await client.expire(req.clientIp, timePeriod)
    }
    if (numRequests > maxReq) {
        return res.status(429).json({ message: `${maxReq} request per ${timePeriod} second allowed` })
    }
    next()
}

export { CustomRateLimiter }