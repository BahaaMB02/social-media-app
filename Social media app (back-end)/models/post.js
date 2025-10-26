const mongoose = require('mongoose');
const dayjs=require('dayjs')

const commentSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    text:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const postSchema=new mongoose.Schema({
    title:{
        type:String,
    },
    image:{
        type:String
    },
    imagePublicId: { 
        type: String
      },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    comments:[commentSchema]
},{timestamps:true})

// ✅ Virtual Field: formatted createdAt
postSchema.virtual('createdAtFormatted').get(function () {
  return dayjs(this.createdAt).format('YYYY-MM-DD HH:mm');
});

// ✅ Virtual Field: formatted updatedAt
postSchema.virtual('updatedAtFormatted').get(function () {
  return dayjs(this.updatedAt).format('YYYY-MM-DD HH:mm');
});

// 🧠 مهم: عشان virtuals تظهر في JSON
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

module.exports=mongoose.model('Post',postSchema)