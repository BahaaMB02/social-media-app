const express = require('express');
const {registerUser,loginUser,logout}=require('../controllers/auth-user-controller')
const {upload}=require('../config/cloudinary')
const router=express.Router()
const authMiddleware=require('../middlewares/auth')

router.post('/register',upload.single('profilePicture'),registerUser)
router.post('/login',loginUser)
router.post('/logout',authMiddleware,(req, res) => {
  // لو بتستخدم cookie
  res.clearCookie('token');

  // أو مفيش cookie خالص، بس ترد برسالة
  res.status(200).json({ message: 'Logged out successfully' });
});
module.exports=router