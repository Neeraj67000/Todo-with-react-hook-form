import express from "express";
import { MongoClient } from 'mongodb'
import 'dotenv/config'
import cors from "cors";

const client = new MongoClient(process.env.MONGO_LOCAL_URI);
const dbName = 'myTodos';
client.connect();
const db = client.db(dbName);
const collection = db.collection('todos');


const app = express()
const port = 3000
app.use(express.json());


const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions));

app.get('/', async (req, res) => {
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
})
app.post('/', async (req, res) => {
    res.json(req.body)
    const insertResult = await collection.insertOne(req.body);
})
app.delete('/', async (req, res) => {
    res.status(200).json({ message: `Resource with ID ${req.body.id} deleted successfully` });
    const deleteResult = await collection.deleteOne({ id: req.body.id });

})
app.put('/', async (req, res) => {
    const updateResult = await collection.updateOne({ id: req.body.id }, { $set: { isCompleted: req.body.isCompleted } });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})