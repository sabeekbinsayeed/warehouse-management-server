const express = require('express')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const cors = require('cors');
app.use(cors())
app.use(express.json())



const port = process.env.PORT || 5000


app.get('/', (req, res) => {
    res.send('Alhamdulillah, request send ')
})

app.listen(port, () => {
    console.log('listening to port .')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pyiq7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// mongosh "mongodb+srv://cluster0.pyiq7.mongodb.net/myFirstDatabase" --apiVersion 1 --username dbuser

async function run() {
    try {
        client.connect();
        const productCollection = client.db("warehouse").collection("products");
        const taskCollection = client.db("warehouse").collection("taskCollection");

        app.get('/task', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });


        app.get('/tasks', async (req, res) => {

            res.send({ "id": 1 });
        });
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })



        app.post('/task', async (req, res) => {

            const newTask = req.body;



            const result = await taskCollection.insertOne(newTask);

            res.send({ result: "sucess" })
            console.log(`A document was inserted with the _id: ${result.insertedId}`);



        })


        app.get('/products', async (req, res) => {
            // const email = req.query.email;
            // console.log(email)
            // const query = { email: email };

            // const result = await productCollection.findOne(query);
            // res.send(result)

            try {

                const query = {}
                const cursor = productCollection.find(query);
                const products = await cursor.toArray();
                res.send(products);
            }
            catch (err) {

                res.json({ message: 'error' })
            }


        });

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })


        app.post('/products', async (req, res) => {

            const newProduct = req.body;
            console.log(newProduct);

            res.send({ result: "sucess" })

            const result = await productCollection.insertOne(newProduct);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);

            // npm install react-router-dom@6
            // const user = req.body;
            // user.id = users.length + 1;
            // users.push(user);
            // res.send(user)

        })

        // update product
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            console.log(updatedProduct)
            console.log(id)
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {

                    quantity: updatedProduct.quantity
                }
            };
            const result = await productCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        })

        app.get('/products/:id', async (req, res) => {

            try {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const products = await productCollection.findOne(query);
                res.send(products);
            }
            catch {
                res.send({})
            }

        });





    }
    finally {

    }
}



run().catch(console.dir);
