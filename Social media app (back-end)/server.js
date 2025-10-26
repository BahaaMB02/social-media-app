require('dotenv').config()
const express = require('express');
const cors = require("cors");
const app=express()
const connectToDb=require('./database/db')
const authUserRouter=require('./routes/auth-user-route')
const userRouter=require('./routes/user-route')
const postRouter=require('./routes/post-route')
const port=process.env.PORT
connectToDb()

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json())


app.use('/api/auth',authUserRouter)
app.use('/api/user',userRouter)
app.use('/api/post',postRouter)

app.listen(port,()=>{
    console.log(`server is running at port ${port}`);
    
})
