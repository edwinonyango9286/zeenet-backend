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
    name: {
      type: String,
      required: [true, "Title is required."],
      unique: true,
      index: true,
      trim: true,
      minlength: [2, "Title must be atleast 2 characters long."],
      maxlength: [72, "Title must be atmost 72 characters long."],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

brandSchema.pre("save", function (next) {
  this.name = this.name.replace(/\b\w/g, (char) => char.toUpperCase());
  next();
});

module.exports = mongoose.model("Brand", brandSchema);
