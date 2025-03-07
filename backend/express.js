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
app.use(cors({
    origin: '*'
}));


app.get('/', async (req, res) => {
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
})
app.post('/', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.json(req.body)
    const insertResult = await collection.insertOne(req.body);
})
app.delete('/:id', async (req, res) => {
    const deleteId = req.params.id;
    console.log(deleteId);
    res.status(200).json({ message: `Resource with ID ${req.body.id} deleted successfully` });
    await collection.deleteOne({ id: req.body.id });
})
app.delete('/', async (req, res) => {
    res.status(200).json({ message: `Resource with ID ${req.body.id} deleted successfully` });
    await collection.deleteMany({ isCompleted: true });
})
app.put('/', async (req, res) => {
    const updateResult = await collection.updateOne({ id: req.body.id }, { $set: { isCompleted: req.body.isCompleted } });
    res.sendStatus(200);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})