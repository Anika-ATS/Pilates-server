const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT||5000;

//midddleware
app.use(cors());
app.use(express.json());

//driver

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ashfkhm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    //all instructors
    const instructorCollection=client.db("PilatesDB").collection("Instructors");
    app.get('/instructors', async(req, res) => {
        const result=await instructorCollection.find().toArray();
        //  const result=await cursor.toArray();
        res.send(result);
       })
    
     //AddaClass collection
     //get data from second db conditional email
     app.get('/addAclass', async(req, res) => {
        console.log(req.query.email);
        // console.log(req.query);
        let query = {};
       
        if(req.query?.email)
        {
            query={email:req.query.email};
        }
        const result=await ADDaClassCollection.find(query).toArray() ;
  
        res.send(result);
  
       })
  
       //send data from client to server data
       app.post('/addAclass', async(req, res) => {
         const AddaClass=req.body;
         console.log(AddaClass);
         const result=await ADDaClassCollection.insertOne(AddaClass);
         res.send(result);
  
  
       })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Pilates Butterfly')
  })

app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})