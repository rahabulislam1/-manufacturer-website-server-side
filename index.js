const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.urkp7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const toolsCollection = client.db("toolsCollection").collection("tools");
        const usersCollection = client.db("toolsCollection").collection("user");
        const ordersCollection = client.db("toolsCollection").collection("orders");
        const paymentCollection = client.db("toolsCollection").collection("payment");
        const reviewsCollection = client.db("toolsCollection").collection("reviews");
        const profilesCollection = client.db("toolsCollection").collection("profile");



    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('hello world');
})
app.listen(port, () => {
    console.log(`port: ${port}`)
})



