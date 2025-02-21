const mongoose = require("mongoose");
const {
  Types: { ObjectId },
} = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    createdBy: {
      type: ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: (id) => {
          return ObjectId.isValid(id);
        },
        message: "Invalid user Id",
      },
    },
    description: {
      type: String,
      required: true,
      minlength: [2, "Description must be atleast 2 characters long."],
      maxlength: [2000, "Description must be atmost 2000 characters long."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
      unique: true,
      trim: true,
      minlength: [2, "Name must be atleast 2 characters long."],
      maxlength: [72, "name must be atmost 72 characters long."],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    items: {
      type: Number,
      default: 0,
    },
    visibility: {
      type: String,
      enum: ["Hidden", "Published", "Scheduled"],
      default: "Published",
    },
    publishedDate: {
      type: Date,
      default: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
