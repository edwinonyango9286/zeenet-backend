const mongoose = require("mongoose");
const {Types: { ObjectId }} = require("mongoose");

const productCategorySchema = new mongoose.Schema(
  {
    createdBy: {
      type: ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: (id) => {
          return ObjectId.isValid(id);
        },
        message: "Invalid category id.",
      },
    },

    updatedBy: {
      type: ObjectId,
      ref: "User",
      validate: {
        validator: (id) => {
          return ObjectId.isValid(id);
        },
        message: "Invalid category id.",
      },
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be atleast 2 characters long."],
      maxlength: [72, "Name must be atmost 72 characters long."],
    },
    description: {
      type: String,
      required: true,
      minlength: [2, "Description must be atleast 2 characters long."],
      maxlength: [2000, "Description must be atmost 2000 characters long."],
    },
    slug:{
      type:String,
      required:true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: ObjectId,
      ref: "User",
      validate: {
        validator: (id) => {
          return ObjectId.isValid(id);
        },
        message: "Invalid category id.",
      },
    },
    items: {
      type: Number,
      default: 0,
    },
    visibility: {
      type: String,
      enum: ["Hidden", "Visible"],
      default: "Visible",
    },
    publishedDate: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductCategory", productCategorySchema);
