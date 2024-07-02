// index.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

const testSchema = mongoose.Schema({
    name: {
        type: String
    }
})

const testModel = mongoose.model("tester", testSchema)

app.get('/', async (req, res) => {
    // res.send');
    const data = await testModel.findOne();
    res.json(data)
});

app.post("/", async (req, res) => {
    const newdata = await testModel.create({ name: "raseek" })
    res.json(newdata)
})

app.listen(8000, () => {
    console.log(`App running on port ${8000}`);
});
