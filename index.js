const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//const uri = 'mongodb://localhost:27017'
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8gaczek.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const serviceCollection = client.db('serviceReviewAssign').collection('services');
    const reviewCollection = client.db('serviceReviewAssign').collection('reviews');

    app.get('/limitedservices', async (req, res) => {
      const query = {}
      const cursor = serviceCollection.find(query);
      const services = await cursor.sort({ timestamp: -1 }).limit(3).toArray();
      res.send(services);
    })

    app.get('/services', async (req, res) => {
      const query = {}
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    })

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    })

    //review api
    app.get('/reviews', async (req, res) => {
      let query = {};

      if (req.query.email) {
        query = {
          email: req.query.email
        }
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    
    app.get('/review/:id', async (req, res) => {
      const { id } = req.params;
      const query = { _id: ObjectId(id) }
      const result = await reviewCollection.findOne(query);
      console.log(result)
      res.send(result)
    });
    app.get('/reviews/:id', async (req, res) => {
      const { id } = req.params;
      const query = { service: (id) }
      const result = await reviewCollection.find(query).toArray();
      console.log(result)
      res.send(result)
    });

    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result)
    })

    app.post('/add_service', async (req, res) => {
      const review = req.body;
      const result = await serviceCollection.insertOne(review);
      res.send(result)
    })

    //delete review
    app.delete('/reviews/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await reviewCollection.deleteOne(query);
      console.log(result)
      res.send(result)
    })

    //update
    app.patch('/review/:id', async (req, res) => {
      const { id } = req.params;
      const result = await reviewCollection.updateOne({ _id: ObjectId(id) }, { $set: req.body });
      if (result.matchedCount) {
        res.send({
          success: true,
          message: `successfully updated ${req.body.name}`,
        });
      } else {
        res.send({
          success: false,
          error: "Couldn't update  the product",
        });
      }
    });

  } finally {

  }
} run().catch(console.dir);


app.listen(port, () => {
  console.log(`raning on port ${port}`)
})