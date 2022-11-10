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
function verifyJwt(req,res,next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
      return  res.status(401).send({message: 'unauthorized access'})
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,function(err,decoded){
        if(err){
         return   res.status(401).send({message: 'unauthorized access'})
        }
        req.decoded =decoded;
        next()
    })

}
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
       app.post('/services',async(req,res)=>{
        const order = req.body;
        const result = await serviceCollection.insertOne(order);
        res.send(result);
        })

       app.post('/jwt',async(req,res)=>{
        const user = req.body;
        const token =jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn: '1h'});
        res.send({token})
       })
       app.get('/services/:id',async(req,res)=> {
        const id=req.params.id;
        const query={_id: ObjectId(id)};
        const service=await serviceCollection.findOne(query);
        res.send(service);
       })
       app.delete('/orders/:id',verifyJwt,async(req,res)=>{
        
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
      app.get('/orders',verifyJwt, async(req,res)=>{
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

        app.get('/orders/:id',async(req,res)=>{
            const id=req.params.id;
            const  query= {_id: ObjectId(id)}
            const result=await orderCollection.findOne(query);
            res.send(result)
        })
        app.put('/orders/:id',async(req,res)=>{
            const id = req.params.id;
            const query= {_id: ObjectId(id)};
            //const result=async userCollection.
            const user=req.body;
            const option= {upsert: true}
            const updatedUser={
                $set: {
                    
                    message:user.name,
                    phone:user.address,
                    email: user.email
                }
            }
            const result= await orderCollection.updateOne(query,updatedUser,option);
            res.send(result)
        })

   
  



    
 }

 finally{

}

}
run().catch(error => console.log(error))


app.listen(port,() =>{
    console.log("genius car server car is running",port);
})
