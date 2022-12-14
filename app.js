//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
require('dotenv').config();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password'] });
const User=mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
})
app.get("/login",function(req,res){
  res.render("login");
})
app.get("/register",function(req,res){
  res.render("register");
})
app.post("/register",function(req,res){
  var newUser=new User({
    email:req.body.username,
    password:req.body.password
  })
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }
    else{
      console.log(err);
    }
  })
})
app.post("/login",function(req,res){
  var uname=req.body.username;
  var pass=req.body.password;
  User.findOne({email:uname},function(err,docs){
    if(!err){
      if(docs.password===pass){
        res.render("secrets");
      }
      else{
        console.log("Incorrect details");
        res.redirect("/");
      }
    }
    else{
      console.log(err);

    }
  })
})
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
