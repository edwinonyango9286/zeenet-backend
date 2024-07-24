const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const {
  Schema,
  Types: { ObjectId },
} = require("mongoose");
const crypto = require("crypto");

var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 16,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 16,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      lowercase: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    
    cart: {
      type: Array,
      default: [],
    },
    address: {
      type: String,
      default: null,
    },
    wishlist: [
      {
        type: ObjectId,
        ref: "Product",
      },
    ],
    refreshToken: {
      type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },

  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
