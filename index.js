const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors= require('cors');
//const jwt = require('jsonwebtoken');
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
    app.get('/services',async(req,res)=>{
        const query = {};
        const cursor= serviceCollection.find(query);
       const services= await cursor.toArray();
        res.send(services);
       })


    
 }

 finally{

}

}
run().catch(error => console.log(error))


app.listen(port,() =>{
    console.log("genius car server car is running",port);
})
