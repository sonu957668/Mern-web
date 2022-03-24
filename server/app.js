const dotenv=require('dotenv');
const express=require('express');
const bcryptjs = require('bcryptjs');
const jwt=require('jsonwebtoken');
const cookieparser = require('cookie-parser');

const app=express();
//config env file
dotenv.config({path:'./config.env'});
require('./db/conn.js');
const port=process.env.PORT;

//Require model
const User=require('./models/userSchema'); 
//const e = require('express');

//get data and cookies from frontend
app.use(express.json());
app.use(express.urlencoded({extened:false}));
app.use(cookieparser());

app.get('/',(req,res)=>{
    res.send('hello world');
})

//Registration
app.post('/register',async (req,res)=>{
    try{
//Get Data
    const fname=req.body.fname;
    const lname=req.body.lname;
    const email=req.body.email;
    const password=req.body.password;
    
    const createUser=new User({
        fname:fname,
        lname:lname,
        email:email,
        password:password
    });
//Save method is used to Create user
    const created=await createUser.save()
    console.log(created);
    res.status(200).send("Registered");
    }
catch(error){
    res.status(400).send(error)
    }
})
//login user
app.post('/login',async(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;

        const user=await User.findOne({email:email});
        
        if(user){
            //varify password
            const isMatch=await bcryptjs.compare(password, user.password);            
            if(isMatch){
               /*const token=await user.generateToken();
                res.cookie("jwt",token,{
                    expires:new Date(Date.now() + 86400000),
                    httpOnly:true
                })*/
                res.status(200).send("LoggedIn")
            }
            else{
                res.status(400).send('Invalid creditential here');
            }
           
        } else{
            res.status(400).send('Invalid creditential');    
        }
    }catch(error){
        res.status(400).send(error);

    }
})



//run server
app.listen(port,()=>{
    console.log('server is running');
})
