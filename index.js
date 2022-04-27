const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5tt4v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const productCollection = client.db('emaJohn').collection('product');

        // get or read all products
        app.get('/products', async(req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        // get or read single product
        app.get('/product/:id', async(req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = {_id: id};
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        // upload or create a product
        app.post('/upload', async(req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        })

        // update product
        app.put('/update/:id', async(req, res) => {
            const updatedProduct = req.body;
            const id = req.params.id;
            console.log(id);
            const filter = {_id: id};
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    updatedProduct
                //   name: updateProduct.name,
                //   category: updateProduct.category,
                //   seller: updateProduct.seller,
                //   price: updateProduct.price,
                //   stock: updateProduct.stock,
                //   img: updateProduct.img,
                //   quantity: updateProduct.quantity
                }
              };
              const result = await productCollection.updateOne(filter, updateDoc, options);
              res.send(result);
        })


        // delete product
        app.delete('/product/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: id};
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running ema john server');
})

app.listen(port, () => {
    console.log('Listening to port', port);
})