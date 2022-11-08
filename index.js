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


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8gaczek.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri)

async function run(){
try{
const serviceCollection = client.db('serviceReviewAssign').collection('services')


app.get('/limitedservices', async(req, res)=>{
  const query = {}
  const cursor = serviceCollection.find(query);
  const services = await cursor.limit(3).toArray();
  res.send(services);
})

app.get('/services', async(req, res)=>{
    const query = {}
    const cursor = serviceCollection.find(query);
    const services = await cursor.toArray();
    res.send(services);
})

app.get('/services/:id', async(req, res)=>{
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const service = await serviceCollection.findOne(query);
  res.send(service);
})

}finally{

}
}run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})