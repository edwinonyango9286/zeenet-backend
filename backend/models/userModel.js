const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const {
  Schema,
  Types: { ObjectId },
} = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 32,
      trim: true,
      index: true,
    },
    lastname: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 32,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      minlength: 2,
      maxlength: 32,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      triem: true,
      index: true,
    },
    avatar: {
      type: String,
      default:
        "https://www.hotelbooqi.com/wp-content/uploads/2021/12/128-1280406_view-user-icon-png-user-circle-icon-png.png",
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 200,
      trim: true,
    },
    role: {
      type: String,
      default: "user",
      lowercase: true,
      trim: true,
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
      trim: true,
    },
    wishlist: [
      {
        type: ObjectId,
        ref: "Product",
      },
    ],
    refreshToken: {
      type: String,
      require: false,
      unique: true,
      sparse: true, 
      trim: true,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
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
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
