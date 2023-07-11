//data from database mongodb;
const express=require('express');
const cors=require('cors');
const Jwt=require('jsonwebtoken');
const jwtKey='e-commerce';
// const mongoose=require('mongoose');
require ('./db/config');
 const User=require('./db/User');
 const Product=require('./db/Product');
const app=express();
app.use(express.json());
app.use(cors());


//for api calling
app.post("/register",async(req,resp)=>{
    let user=new User(req.body);
    let result= await user.save();
    result=result.toObject();
    delete result.password
    resp.send(result);
})
// const connectDB=async()=>{
//     mongoose.connect('mongodb://localhost:27017/ecom');
//     const productSchema=new mongoose.Schema({});
//     const product=mongoose.model('product',productSchema);
//     const data=await product.find();
//     console.log(data);
// }
// connectDB();

// app.get("/",(req,resp)=>{
//     resp.send("app is working ...")
// })

//login routes

app.post('/login',async(req,resp)=>{
   console.log(req.body)
   if(req.body.password && req.body.email) {
    let user=await User.findOne(req.body).select("-password");
    if(user){
        Jwt.sign({user},jwtKey,{expiresIn:"2h"},(err,token)=>{
      if(err){
        resp.send({result:'something went wrong please try after sometime'})
      }
 
 
            resp.send({user,auth:token})
        })
        resp.send(user)
    } else{
        resp.send({result:'No user found'})
    }
   }else{
    resp.send({result:'No user found'})
   }

})

// add products route api

app.post("/product",async(req,resp)=>{
    let product=new Product(req.body);
    let result=await product.save();
    resp.send(result)
})

app.get("/products",async(res,resp)=>{
    let products=await Product.find();
    if(products.length>0){
        resp.send(products)
    }
    else{
        resp.send({result:"No products found"})
    }
});
//api for delete id

app.delete("/product/:id",async(req,resp)=>{
    const result=await Product.deleteOne({_id:req.params.id})
    resp.send(result);

});

// to get data from api

app.get("/product/:id",async(req,resp)=>{
    let result=await Product.findOne({_id:req.params.id});
    if(result){
        resp.send(result)
    }
    else{
        resp.send({result:"No record found"})
    }
})
// for updating product
app.put("/product/:id",async(req,resp)=>{
    let result=await Product.updateOne(
        {
            _id:req.params.id
        },
        {
            $set:req.body
        }
    )
     resp.send(result)
});

/// search api

app.get("/search/:key",async(req,resp)=>{
    let result=await Product.find({
        "$or":[
            {name:{$regex:req.params.key}},
            {company:{$regex:req.params.key}},
            {category:{$regex:req.params.key}},
            {price:{$regex:req.params.key}}


        ]
    });
    resp.send(result)

})


app.listen(4000);