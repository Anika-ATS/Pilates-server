const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId  } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT||5000;

//midddleware
// app.use(cors());
const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))





app.use(express.json());

//driver


const uri = "mongodb+srv://mainUser:3zoMRQR6bNYLCm3N@cluster0.ashfkhm.mongodb.net/?retryWrites=true&w=majority";
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ashfkhm.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    client.connect((error)=>{
      if(error){
        console.log(error)
        return;
      }
    });
    
    //users
    const userCollection=client.db("PilatesDB").collection("users");
    //Approve cls
    const ApproveCollection=client.db("PilatesDB").collection("ApproveCls");
    //all instructors collection of database
    const instructorCollection=client.db("PilatesDB").collection("Instructors");
    //an instructor add a class collection
    const ADDaClassCollection = client.db("PilatesDB").collection("AddaClass");

    //jwt token
   
    app.post('/jwt', (req, res) => {
      const user=req.body;
      const token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})
    
      res.send({token});


    });
    


    //get all users
    app.get('/users', async(req, res) => {
      const result=await userCollection.find().toArray();
      //  const result=await cursor.toArray();
      res.send(result);
     })


    //post users
    app.post('/users', async(req, res) => {
      const users=req.body;
      
      const result=await userCollection.insertOne(users);
      res.send(result);


    });

    //make admin
    app.patch('/users/admin/:id', async(req, res) => {
      const id= req.params.id;
      console.log(id)
      const filter={ _id: new ObjectId(id)};
      const updateDoc={
        $set:{
          role:'admin'
      

        },
      };
      
      const result=await userCollection.updateOne(filter,updateDoc) ;
      res.send(result);
     });

    //  make instructor
     app.patch('/users/instructor/:id', async(req, res) => {
      const id= req.params.id;
      console.log(id)
      const filter={ _id: new ObjectId(id)};
      const updateDoc={
        $set:{
          role:'instructor'

        },
      };
      
      const result=await userCollection.updateOne(filter,updateDoc) ;
      res.send(result);
     });





    //alll instructors
    app.get('/instructors', async(req, res) => {
        const result=await instructorCollection.find().toArray();
        //  const result=await cursor.toArray();
        res.send(result);
       })
    
    

     //get all cls data from second db to  admin page
     app.get('/NAddaClass', async(req, res) => {
      const result=await ADDaClassCollection.find().toArray();
      //  const result=await cursor.toArray();
      res.send(result);
     })

     //get  cls data from second db based on  conditional email
     app.get('/NAddaClass', async(req, res) => {
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


        //AddaClass collection
       //send data from client to server data
       app.post('/NAddaClass', async(req, res) => {
         const AddaClass=req.body;
         console.log(AddaClass);
         const result=await ADDaClassCollection.insertOne(AddaClass);
         res.send(result);
  
  
       });

    //post Approvecls
    app.post('/ApproveCls', async(req, res) => {
      const Acls=req.body;
      
      const result=await ApproveCollection.insertOne(Acls);
      res.send(result);


    });
    //get ApproveCls
    app.get('/ApproveCls', async(req, res) => {
      const result=await ApproveCollection.find().toArray();
      //  const result=await cursor.toArray();
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