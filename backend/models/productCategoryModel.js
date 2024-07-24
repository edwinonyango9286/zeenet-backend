const mongoose = require("mongoose");

var productcategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      minlength: 2,
      maxlength: 32,
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("ProductCategory", productcategorySchema);
