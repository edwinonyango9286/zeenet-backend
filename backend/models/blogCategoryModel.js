const mongoose = require("mongoose");

// Hostname                    1   255
// Domain Name                 4   253
// Email Address               7   254
// Email Address [1]           3   254
// Telephone Number            10  15
// Telephone Number [2]        3   26
// HTTP(S) URL w domain name   11  2083
// URL [3]                     6   2083
// Postal Code [4]             2   11
// IP Address (incl ipv6)      7   45
// Longitude                   numeric 9,6
// Latitude                    numeric 8,6
// Money[5]                    numeric 19,4

const blogCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      unique: true,
      index: true,
      trim: true,
      minlength: [2, "Title must be atleast 2 characters long."],
      maxlength: [72, "Title must be atmost 72 characters long."],
    },
  },
  {
    timestamps: true,
  }
);

blogCategorySchema.pre("save", function (next) {
  this.title = this.title.replace(/\b\w/g, (char) => char.toUpperCase());
  next();
});

module.exports = mongoose.model("BlogCategory", blogCategorySchema);
