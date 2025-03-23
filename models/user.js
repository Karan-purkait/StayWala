const mongoose=require("mongoose")
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;
const userschema=new mongoose.Schema(
    {   
        Name:{
            type: String,
            required: true,
        },
        Email:{
            type: String,
            required: true,
            unique: true,
        },
        Password:{
            type:String,
            required:true,
        }
    }
)
userschema.pre('save', async function(next) {
    if (!this.isModified('Password')) return next();
    this.Password = await bcrypt.hash(this.Password, SALT_ROUNDS);
    next();
});
const Users=mongoose.model('user',userschema);
module.exports=Users;
      