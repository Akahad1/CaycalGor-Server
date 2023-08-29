const express=require("express")
const cors =require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
const ReviewCollction =client.db('CycalGor').collection("Reviews")
const CartProductCollction =client.db('CycalGor').collection("CartProduct")
async function run() {
  try {
  
  await client.connect();
 
  await client.db("admin").command({ ping: 1 });
  

    app.get('/product',async (req,res)=>{
        const qurey={}
        const result= await ProductsCollction.find(qurey).limit(6).toArray()
        res.send(result)


    })
    app.get('/products',async (req,res)=>{
      
      const page =parseInt(req.query.page) || 0
      const limit =parseInt(req.query.limit)||5
      const skip=page*limit
      const bike=req.query.bike;
      const query1={category:bike}
      const query={}
      const query2=bike?query1: query
     
       
        const result= await ProductsCollction.find( query2).skip(skip).limit(limit).toArray()
        res.send(result)


    })
    app.get('/products/:id',async(req,res)=>{
      const id =req.params.id;
      console.log(id)
      const query ={_id:ObjectId(id)}
      const result= await ProductsCollction.findOne(query)
      res.send(result)
    })

    app.get('/totalproducts',async (req,res)=>{
       
        const result= await ProductsCollction.estimatedDocumentCount()
        res.send({totalproducts:result})


    })
    app.post('/reviews',async(req,res)=>{
      const review=req.body;
      const result= await ReviewCollction.insertOne(review)
      res.send(result)

    })
    app.get('/reviews',async(req,res)=>{
      const reviewId=req.query.review;
      const qurey={ProductsId : reviewId}

      const result= await ReviewCollction.find(qurey).toArray()
      res.send(result)

    })
    app.post('/addCart',async(req,res)=>{
      const cartProduct=req.body;
      const result = await CartProductCollction.insertOne(cartProduct)
      res.send(result)
    })

    app.get('/addCart',async (req,res)=>{
      const qurey={}

      const result =await CartProductCollction.find(qurey).toArray()
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