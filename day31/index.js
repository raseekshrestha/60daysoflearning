import express from 'express';

const app = express();


app.get("/", (req, res) => {
    res.send("for docker")
})

app.listen(8000, () => {
    console.log("running on port 8000")
})