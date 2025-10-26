require('dotenv').config()
const User=require('../models/user')
const bcrypt=require('bcryptjs')
const jwt =require('jsonwebtoken')
const {cloudinary}=require('../config/cloudinary')

const registerUser=async(req,res)=>{

    try {
        const {name,username , profilePicture, email , password}=req.body
        const checkExists=await User.findOne({
        $or:[{name},{username},{email}]

        })

        if(checkExists)
        {
            return res.status(400).json({
                success:false,
                message:"this user is already exists"
            })
        }

        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        
        const newUser=new User({
            name,
            username,
            profilePicture:req.file ? req.file.path : null,
            email,
            password:hashedPassword
        })

        await newUser.save()
        if(newUser){
        
        return res.status(201).json({
            success:true,
            message:'new user is registered succesfully',
            data:newUser
        })
        }
        else{
            return res.status(400).json({
            success:false,
            message:'failed to register a new user',
            })
        }
    } catch (error) {
       console.log(error);
       return res.status(500).json({
          success:false,
          message:'something went wrong',
       }) 
    }

}

const loginUser=async (req,res)=>{
    try {
      const {username,password}=req.body
      const user=await User.findOne({username})

    if(!user)
    {
        return res.status(400).json({
            success:false,
            message:"this user is not exists"
        })
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch)
    {
            return res.status(400).json({
            success:false,
            message:"invaild password"
        })   
    }
 
    const payload={
        userId:user._id,
        username:user.username,
    }
    const accessToken=jwt.sign({payload},process.env.JWT_SECRET_KEY,{expiresIn:'1h'})
    
    return res.status(200).json({
        success:true,
        message:`${user.username} is loggin successfully`,
        accessToken,
        data:user
    })
    } catch (error) {
        console.log("failed to login",error);
        return res.status(500).json({
            success:false,
            message:"something went wrong"
        })
    }
}

module.exports={
    registerUser,
    loginUser
}