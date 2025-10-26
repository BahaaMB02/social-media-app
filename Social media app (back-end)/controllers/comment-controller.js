const Post=require('../models/post')
const User=require('../models/user')

const addComment=async (req,res)=>{

    try {
        const postId  = req.params.id;
        const { text } = req.body;
        const userId=req.userInfo.payload.userId
        if(!userId)
        {
             return res.status(401).json({
                success: false,
                message: "Unauthorized, user not found"
            });   
        }
        const post =await Post.findById(postId)
        if(!post)
        {
            return res.status(404).json({
                success:false,
                message:"Post Not Found"
            })
        }

        const newCommnet={
            user:userId,
            text
        }

        post.comments.push(newCommnet)
        await post.save()

       const populatedPost = await Post.findById(postId)
       .populate('comments.user', 'name username profilePicture');

        const populatedComments = populatedPost.comments;

        const populatedComment = populatedComments[populatedComments.length - 1];


        return res.status(201).json({
            success:true,
            message:"comment added successfully",
            data:populatedComment
        });

    } catch (error) {
        console.log('error while adding comment',error);
        return res.status(500).json({
            success:false,
            message:"something went wrong, please try again"
        })
        
    }

}


module.exports={
    addComment
}