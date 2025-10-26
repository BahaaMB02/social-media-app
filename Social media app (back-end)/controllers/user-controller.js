const User=require('../models/user')

const getUsers=async (req,res)=>{
    try {
        const users=await User.find({})
        if(!users)
        {
            return res.status(404).json({
                success:false,
                message:"Users Not Found"
            })
        }
        return res.status(200).json({
            success:true,
            message:`${users.length} user(s) is Found`,
            data:users
        })    
    } catch (error) {
        console.log("error while fetching all users",error);
        return res.status(500).json({
            success:false,
            message:"something went wrong"
        })
    }
}

const userPosts=async (req,res)=>{
    try {
       const user=await User.findById(req.params.id).populate('posts')
    //    console.log(user)        
    return res.status(200).json({
        success:true,
        data:user
    })
    } catch (error) {
        console.log("error while fetching user's posts",error);
        return res.status(500).json({
            success:false,
            message:"something went wrong"
        })
        
    }   

}

module.exports={
    getUsers,
    userPosts
}