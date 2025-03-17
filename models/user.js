const mongoose=require("mongoose")
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
const Users=mongoose.model('user',userschema);
module.exports=Users;
      