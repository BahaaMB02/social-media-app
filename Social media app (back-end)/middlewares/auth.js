require('dotenv').config()
const jwt=require('jsonwebtoken')

const authMiddleware=async (req,res,next)=>{
    const authHeader=req.headers['authorization']
    const token=authHeader && authHeader.split(' ')[1]
    if(!token)
    {
        return res.status(401).json({
            success:false,
            message:"Access Denied! no token provided"
        })
    }

    try {
        const decodedToken=jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.userInfo=decodedToken
        next()
    } catch (error) {
        console.log(error);
            return res.status(500).json({
            success:false,
            message:'Access Denied! No token provided'
        });
    }
}

module.exports=authMiddleware


