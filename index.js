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

        function verifyJwt(req, res, next) {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).send({ message: 'UnAuthorized Access' });
            }
            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
                if (err) {
                    return res.status(403).send({ message: 'Forbidden Access' })
                }
                req.decoded = decoded;
                next();
            });

        }

        app.post('/create-payment-intent', async (req, res) => {
            const service = req.body;
            const price = service.price;
            const amount = price * 100;
            try {
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: amount,
                    currency: 'usd',
                    payment_method_types: ["card"]
                });
                res.json({
                    clientSecret: paymentIntent.client_secret,
                });
            }
            catch (e) {
                res.status(400).json({ error: { message: e.message } });
            }
        });

        app.post('/orders', async (req, res) => {
            const data = req.body;
            const doc = {
                name: data.name,
                email: data.email,
                quantity: data.quantity,
                address: data.address,
                phone: data.phone,
                price: data.price
            }
            const result = await ordersCollection.insertOne(doc);
            res.send(result);
        });
        app.post('/reviews', async (req, res) => {
            const data = req.body;
            const doc = {
                name: data.name,
                email: data.email,
                img: data.img,
                review: data.review
            }
            const result = await reviewsCollection.insertOne(doc);
            res.send(result);
        });


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



