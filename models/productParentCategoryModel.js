const mongoose = require("mongoose");
const {Types:{ObjectId}} = require("mongoose")


const productParentCategorySchema = new mongoose.Schema({
    createdBy:{
        type:ObjectId,
        ref:"User",
        required:true,
        validate: {
            validator: (id) => {
              return ObjectId.isValid(id);
            },
            message: "Invalid category id.",
          },
    },
    updatedBy:{
        type:ObjectId,
        ref:"User",
        validate: {
            validator: (id) => {
              return ObjectId.isValid(id);
            },
            message: "Invalid category id.",
          },
    },
    name:{
        type:String,
        required:true,
        minlength:[2, "Name must be at least 2 characters long."],
        maxlength:[72, "Name must be atmost 72 characters long."]
    },
    description:{
        type:String,
        required:true,
        minlength:[2,"Description must be at least 2 characters long."],
        maxlength:[2000,"Description must be at most 2000 characters long."]
    }, 
    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedAt:{
        type:Date,
        default:null
    },
    deletedBy:{
        type:ObjectId,
        ref:"User",
        validate: {
            validator: (id) => {
              return ObjectId.isValid(id);
            },
            message: "Invalid category id.",
          },
    }
},{
    timestamps:true
})

module.exports = mongoose.model("ProductParentCategory", productParentCategorySchema)