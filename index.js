const express=require("express")
const cors =require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app =express()

app.use(cors())
app.use(express.json())
require('dotenv').config()

const port=process.env.PORT  || 5000






const uri = `mongodb+srv://${process.env.USER_Name}:${process.env.USER_PASS}@cluster0.xuxoczf.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const ProductsCollction = client.db('CycalGor').collection('Products')
async function run() {
  try {
  
  await client.connect();
 
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.get('/products',async (req,res)=>{
        const qurey={}
        const result= await ProductsCollction.find(qurey).toArray()
        res.send(result)


    })
   
   

  } finally {
    
  }
}
run().catch(error=>console.log(error));


app.get('/',(req,res)=>{
    res.send("Hello babie")

})
app.listen(port,()=>{
    console.log("server is running")
})