const express=require('express')
const router=express.Router()
const {getUsers,userPosts}=require('../controllers/user-controller')
const authMiddleware=require('../middlewares/auth')
//get all users 
router.get('/get',authMiddleware,getUsers)

//get user's posts
router.get('/posts/:id',userPosts)

module.exports=router