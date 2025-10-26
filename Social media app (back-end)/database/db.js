require('dotenv').config()
const mongoose = require('mongoose');

const connectToDb = async()=>{
    try {
         await mongoose.connect(process.env.MONGO_URI)
         console.log('database connected successfully');
              
    } catch (error) {
        console.log('connection is failed',error);
        process.exit(1)
    }
   

}

module.exports=connectToDb