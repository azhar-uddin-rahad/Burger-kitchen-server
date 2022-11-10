const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors= require('cors');
const jwt = require('jsonwebtoken');
const app =express();
require('dotenv').config()

const port=process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Allah give me a wellness and success');
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jmnkad8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
 try{
    const serviceCollection=client.db('products').collection('services');
    const orderCollection=client.db('products').collection('order');
    
    app.get('/servicesHome',async(req,res)=>{
        const query = {};
        const cursor= serviceCollection.find(query);
       const services= await cursor.limit(3).toArray();
        res.send(services);
       })
    app.get('/services',async(req,res)=>{
        const query = {};
        const cursor= serviceCollection.find(query);
       const services= await cursor.toArray();
        res.send(services);
       })

       app.get('/services/:id',async(req,res)=> {
        const id=req.params.id;
        const query={_id: ObjectId(id)};
        const service=await serviceCollection.findOne(query);
        res.send(service);
       })
       app.delete('/orders/:id',async(req,res)=>{
        
        const id = req.params.id;
        const query ={_id: ObjectId(id)};
        const result =await orderCollection.deleteOne(query);
        res.send(result)
       })
       app.patch('/orders/:id', async(req,res)=>{
        const id =req.params.id;
        console.log(id);
        const status= req.body.status
        const query ={_id:ObjectId(id)};
        const updateDoc = {
            $set:{

                status: status

            }
        }
        const result =await orderCollection.updateOne(query,updateDoc)
        res.send(result);

       })
      app.get('/orders', async(req,res)=>{
        const decoded =req.decoded;
        console.log('inside orders api',decoded)
        let query={};
        if(req.query.email){
            query={
                email: req.query.email
            }
        }
        const cursor=orderCollection.find(query);
        const orders =await cursor.toArray();
        res.send(orders)
       })
 
       app.post('/orders',async(req,res)=>{
        const order = req.body;
        const result = await orderCollection.insertOne(order);
        res.send(result);

       })

   
  



    
 }

 finally{

}

}
run().catch(error => console.log(error))


app.listen(port,() =>{
    console.log("genius car server car is running",port);
})
