const express = require('express');
const {getAllPosts,getSinglePost,addPost,updatepost,deletePost}=require('../controllers/post-controller')
const { addComment }=require('../controllers/comment-controller')
const authMiddleware=require('../middlewares/auth')
const {upload}=require('../config/cloudinary')
const router=express.Router()

//routes for posts
router.get('/',getAllPosts)
router.get('/:id',getSinglePost)
router.post('/add',authMiddleware,upload.single('image'),addPost)
router.put('/update/:id',authMiddleware,upload.single('image'),updatepost)
router.delete('/delete/:id',authMiddleware,deletePost)

//routes for comments
router.post('/:id/addcomment',authMiddleware,addComment)


module.exports=router   