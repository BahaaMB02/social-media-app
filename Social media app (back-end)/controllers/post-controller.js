const Post=require('../models/post')
const User=require('../models/user')
const { cloudinary } = require('../config/cloudinary');

const getAllPosts=async (req,res)=>{
    try {
        // 🟡 1. قراءة page و limit من query (مع default قيم)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // 🟡 2. حساب عدد العناصر اللي هنتخطاها
        const skip = (page - 1) * limit;

        // 🟢 3. إجمالي عدد الـ posts
        const totalPosts = await Post.countDocuments();

        const posts=await Post.find({})
        .populate('user' , ' name username profilePicture')
        .populate('comments')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

        if(posts.length===0)
        {
            return res.status(404).json({
                success:false,
                meesage:'no posts found'
            }) 
        }

        return res.status(200).json({
            success:true,
            meesage:`${posts.length} is found`,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            data:posts
        })        
    } catch (error) {
        console.log('failed to fetch all posts',error);
        return res.status(500).json({
            success:false,
            meesage:'something went wrong'
        })        
    }
}

const getSinglePost=async (req,res)=>{
   try {
    const singlePost=await Post.findById(req.params.id)
    .populate('user' , ' name username profilePicture')
    .populate('comments.user','name username profilePicture')
    if(!singlePost)
    {
        return res.status(404).json({
            success:false,
            message:"post Not Found"
        })
    }
    
    return res.status(200).json({
        success:true,
        message:`${singlePost.user.username}'s post`,
        data:singlePost
    })
   } catch (error) {
        console.log('failed to fetch all posts',error);
        return res.status(500).json({
            success:false,
            meesage:'something went wrong'
        })       
   }
}

const addPost=async (req,res)=>{
    try {
        const userId=req.userInfo.payload.userId
        if(!userId)
        {
             return res.status(401).json({
                success: false,
                message: "Unauthorized, user not found"
            });   
        }
        const newPost=new Post({...req.body,
            user:userId,
            image:req.file ? req.file.path : null,
            imagePublicId: req.file ? req.file.filename : null
            })
        await newPost.save()
        
        //add post id to user's posts  
        await User.findByIdAndUpdate(userId, {
            $push: { posts: newPost._id }
         });
        
        if(newPost){
        return res.status(201).json({
            success:true,
            message:"new post added successfully",
            data:newPost,
        })
        }
        else{
            return res.status(400).json({
            success:false,
            message:"failed to add new post"
        })
        }
    } catch (error) {
        console.log('failed to add new post',error);
         return res.status(500).json({
            success:false,
            message:"something went wrong"
         })         
    }

    
}

const updatepost=async (req,res)=>{
    try {
        
        const userId=req.userInfo.payload.userId
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized, user not found"
            });
        }
        //check post is exists
        const post=await Post.findById(req.params.id).populate('user')
        if(!post)
        {
          return res.status(404).json({
            success:false,
            message:"no post is found"
          })
        }

        //check if the user who want to update the post is the same user who create it
        
        if(post.user && post.user._id.toString() !== userId.toString())
        {
          return res.status(403).json({
            success:false,
            message:"not authorized , you must be the post's author to update"
          })
        }

        if (req.file) {
        // امسح الصورة القديمة من Cloudinary
        if (post.imagePublicId) {
            await cloudinary.uploader.destroy(post.imagePublicId);
            }
             req.body.image = req.file.path;         // اللينك المباشر
             req.body.imagePublicId = req.file.filename;
        }  


        //update post
        const updatedPost=await Post.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{
            new:true,
            runValidators:true
        })
        if(updatedPost)
        {
            return res.status(200).json({
                success:true,
                message:"post updated successfully",
                data:updatedPost
            })
        }
        else{
            return res.status(400).json({
            success:false,
            message:"failed to update post",
            })
        }    
    } catch (error) {
        console.log('failed to updated post',error);
        return res.status(500).json({
            success:false,
            message:"something went wrong"
        })
    }
    
}

const deletePost=async (req,res)=>{
    try {
     //check user 
    const userId=req.userInfo.payload.userId
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized, user not found"
            }); 
        }
            //check post is exists
        const post=await Post.findById(req.params.id).populate('user')
        if(!post)
        {
          return res.status(404).json({
            success:false,
            message:"no post is found"
          })
        }
        
    //check if the user who want to update the post is the same user who create it
    if(post.user && post.user._id.toString() !== userId.toString())
    {
        return res.status(403).json({
        success:false,
        message:"not authorized , you must be the post's author to delete"
        })
    }

    //delete photo from cloudinary
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
     }

    //check post exists
    const deletedPost=await Post.findByIdAndDelete(req.params.id,
        {
            new:true
        }
    ) 
    if(deletedPost)
    {
        return res.status(200).json({
            success:true,
            message:"post is deleted successfully"
        })
    }
    
    
    } catch (error) {
        console.log("error while deleting post",error);
        return res.status(500).json({
            success:false,
            message:"something went wrong"
        })
        
    }
}
module.exports={
    getAllPosts,
    getSinglePost,
    addPost,
    updatepost,
    deletePost
}