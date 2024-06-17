const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db")
const { notFound, errorHandler } = require("./middleware/errorMiddleware")

const userRoutes = require("./routes/user.routes")





const app = express();
app.use(cors());
app.use(express.json());



connectDB()

app.get("/", (req, res) => {
    res.send("welsome my world chat app")
})

app.use("/api/user", userRoutes)


// error handlers
app.use(notFound)
app.use(errorHandler)


app.listen(8000, () => {
    console.log("server running on port 8000")
})

