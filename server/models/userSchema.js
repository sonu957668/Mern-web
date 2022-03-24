const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
//User Schema
const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        unique: true
    },
    lname: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})

//hashing the password
userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=bcryptjs.hashSync(this.password,10);
    }
    next();
})
//token to verify user
userSchema.method.generateToken = async function () {
    try {
        let generatedToken = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: generatedToken });
        await this.save();
        return generatedToken;
    } catch (error) {
        console.log(error)
    }
}
// cretae model
const User =new mongoose.model("USER",userSchema);
module.exports=User;