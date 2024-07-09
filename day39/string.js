import client from "./client.js";

const set = async (key, val) => {
    await client.set(key, val)
}

const get = async (key) => {
    console.log(await client.get(key))
}

const setAndLog = async (key, val) => {
    await set(key, val)
    console.log(await get(key))

}

const init = async () => {
    // const result = await client.mget(['user:1', 'user:2'])
    // console.log(result)
    // console.log(await get("user:2"))

    // await client.expire("raseek", 10)

    // get("messages")

    //list

    // await client.lpush("messages", 1)
    // await client.lpush("messages", 2)
    // await client.lpush("messages", 3)
    // await client.lpush("messages", 4)

    // const res = await client.blpop("messages", 40)

    // get the contents of the list
    // param key start end. for all use key 0 -1
    // const res = await client.lrange("messages", 0, 5)

    // len of the list
    // const res = await client.llen("messages")

    // const res = await client.hgetall("cars")

    // const res = await client.hmget("bikes", "madeby", "bike1")


    // console.log(res)
    // set("raseek", "shrestha")
    // get("raseek")

    // console.log(await client.llen("messages"))
    // await client.lpush("messages", "aastha i love you <3 <3")

    // await client.zadd("ipScores", 1, "192.168.1.1")
    // const res = await client.expire("ipScores", 60)
    // console.log(res)
    // await client.del("ip")
    // console.log(await client.lrange("messages", 0, -1))

    const key = "192.168.1.64";
    set(key, 1)
    await client.expire(key, 60)
    // await client.incr("192.168.1.65")
}

init()