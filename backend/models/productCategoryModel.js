const mongoose = require("mongoose");
const {
  Types: { ObjectId },
} = require("mongoose");

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
    name: {
      type: String,
      required: [true, "Title is required"],
      unique: true,
      trim: true,
      minlength: [2, "Title must be atleast 2 characters long."],
      maxlength: [72, "Title must be atmost 72 characters long."],
    },
    description: {
      type: String,
      required: true,
      minlength: [2, "Title must be atleast 2 characters long."],
      maxlength: [2000, "Title must be atmost 2000 characters long."],
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

productCategorySchema.pre("save", function (next) {
  this.name = this.name.replace(/\b\w/g, (char) => char.toUpperCase());
  next();
});

module.exports = mongoose.model("ProductCategory", productCategorySchema);
