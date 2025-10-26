const mongoose = require('mongoose');

const userSchema= new mongoose.Schema({
    name:{
       type:String,
       required:true
    },
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true

    },
    profilePicture:{
      type:String,
      required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    posts:[
        {
         type:mongoose.Schema.Types.ObjectId,
         ref:'Post'
        }
    ],
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ]
        
    
},{timestamps:true})


module.exports=mongoose.model('User',userSchema)