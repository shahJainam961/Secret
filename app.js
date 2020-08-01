require('dotenv').config()
const md5 = require('md5')
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
// const encrypt = require('mongoose-encryption')
const app = express()

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/secretuserDB",{useNewUrlParser:true,useUnifiedTopology:true})

const userSchema = new mongoose.Schema({
    email : String,
    password : String
})

// userSchema.plugin(encrypt, { secret:process.env.KEY , encryptedFields:['password'] });

const User = new mongoose.model("User",userSchema)


app.get("/",function(req,res){
    res.render("home")
})

app.get("/login",function(req,res){
    res.render("login")
})

app.get("/register",function(req,res){
    res.render("register")
})

app.post("/register",function(req,res){

    const newUser = new User({
        email: req.body.email,
        password: md5(req.body.password)
    })
    newUser.save(function(err){
        if(err){console.log(err);}
        else{res.render("secrets")}
    })


})

app.post("/login",function(req,res){

   const email = req.body.email
   const password = md5(req.body.password)

   User.findOne({email: email},function(err,foundUser){
       if(err){console.log(err);}
       else{
           if(foundUser){
               if(foundUser.password === password){
                   res.render("secrets")
               }
               else{
                   console.log("Password Incorrect");
               }
           }
           else{
               console.log("User not found");
           }
       }
   })

})




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
