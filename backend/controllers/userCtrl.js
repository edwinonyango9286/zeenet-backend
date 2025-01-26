const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const expressAsyncHandler = require("express-async-handler");
const { generateAccessToken } = require("../config/accessToken");
const validateMongodbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../controllers/emailCtrl");
const emailValidator = require("email-validator");
const validatePassword = require("../utils/validatePassword");
const redis = require("../utils/redis");

// Register a new user.
const registerUser = expressAsyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      throw new Error("Please fill in all the required fields.");
    }
    const phoneRegex = /^\+?[0-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new Error("Please provide a valid phone number.");
    }
    validatePassword(password);
    if (!emailValidator.validate(email)) {
      throw new Error("Please provide a valid email address.");
    }
    const user = await User.findOne({ email });
    if (user) {
      throw new Error(
        "This email address is already associated with an account. If this account is yours, you can reset your password"
      );
    }
    const createdUser = await User.create(req.body);
    res.status(200).json(createdUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Signin user
const signInUser = expressAsyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Please fill in all the required fields.");
    }
    if (!emailValidator.validate(email)) {
      throw new Error("Please provide a valid email address.");
    }
    validatePassword(password);
    const user = await User.findOne({ email }).select("+password");
    if (user.role === "admin") {
      throw new Error("Not authorised.");
    }
    if (!user) {
      throw new Error(
        "We couldn't find an account associated with this email address. Please check the email and try again."
      );
    }
    if (user && !(await user.isPasswordMatched(password))) {
      throw new Error("Wrong email or password.");
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE),
    });
    res.status(200).json({
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      avatar: user?.avatar,
      accessToken: accessToken,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Sign in admin
const adminSignIn = expressAsyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Please fill in all the required fields.");
    }
    validatePassword(password);
    if (!emailValidator.validate(email)) {
      throw new Error("Please provide a valid email address.");
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("User not found.");
    }
    if (user.role !== "admin") {
      throw new Error("Not authorised.");
    }
    if (!(await user.isPasswordMatched(password))) {
      throw new Error("Wrong email or password.");
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE),
    });
    res.status(200).json({
      firstName: user.firstName,
      email: user.email,
      avatar: user.avatar,
      accessToken: accessToken,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const handleRefreshToken = expressAsyncHandler(async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie.refreshToken) {
      throw new Error("No refresh token in cookies.");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      throw new Error(
        "We could not find a user associated with this refresh token."
      );
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || user.id !== decoded.id) {
        throw new Error("Something is wrong with this refreshtoken...");
      }
      const accessToken = generateAccessToken(user._id);
      res.status(200).json({ accessToken });
    });
  } catch (error) {
    throw new Error(error);
  }
});

const logout = expressAsyncHandler(async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie.refreshToken) {
      throw new Error("No refresh token in cookies.");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        sameSite: "strict",
        httpOnly: true,
        secure: false,
      });
      return res
        .status(200)
        .json({ message: "You have sucessfully logged out." });
    }
    await User.findOneAndUpdate(
      { refreshToken },
      {
        refreshToken: "",
      }
    );
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.status(200).json({ message: "You have succefully logged out." });
  } catch (error) {
    throw new Error(error);
  }
});



const updateAUser = expressAsyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    validateMongodbId(_id);
    const { firstName, lastName, email, phoneNumber } = req.body;
    if (!firstName || !lastName || !email || !phoneNumber) {
      throw new Error("Please fill in all the required fields.");
    }
    if (!emailValidator.validate(email)) {
      throw new Error("Please provide a valid email address.");
    }
    const phoneRegex = /^(\+?254|0)?(7\d{8})$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new Error("Please provide a valid phone number.");
    }
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
      },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      throw new Error("User not found.");
    }
    res.status(200).json({
      updatedUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAUser = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const cacheKey = `user:${id}`;
    const cachedUser = await redis.get(cacheKey);
    if (cachedUser) {
      return res.status(200).json(JSON.parse(cachedUser));
    }
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found.");
    }
    await redis.set(cacheKey, JSON.stringify(user), "EX", 2);
    res.status(200).json({
      user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllUsers = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteAUser = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const deletedUsers = await User.findByIdAndDelete(id);
    if (!deletedUsers) {
      throw new Error("User not found");
    }
    res.status(200).json({ message: "User deleted succesfully", deletedUsers });
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const blockedUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );

    if (!blockedUser) {
      throw new Error("user not found.");
    }
    res.status(200).json({
      blockedUser,
      message: "User is blocked and can not make purchases.",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const unBlockUser = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const unblockedUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true }
    );
    if (!unblockedUser) {
      throw new Error("User not found.");
    }
    res.status(204).json({
      unblockedUser,
      message: "User has been unblocked and can now make purchases.",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = expressAsyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      throw new Error("Please fill in all the required fields.");
    }
    validateMongodbId(_id);
    validatePassword(password);
    validatePassword(confirmPassword);
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found.");
    }
    if (password) {
      user.password = password;
      const updatedPassword = await user.save();
      res.status(200).json(updatedPassword);
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const resetUserPasswordToken = expressAsyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new Error("Please provide your email.");
    }
    if (!emailValidator.validate(email)) {
      throw new Error("Please provide a valid email address.");
    }
    const user = await User.findOne({ email });
    if (!user)
      throw new Error(
        "We couldn't find an account associated with this email address. Please check the email and try again."
      );
    const resetPasswordToken = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset your password. This link is valid 10 minutes from now. <a href='https://zeenet-frontstore.onrender.com/reset-password/${resetPasswordToken}'>Click Here</>`;
    const data = {
      to: email,
      text: "Zeenet e-commerce.",
      subject: "Password reset link",
      html: resetURL,
    };
    sendEmail(data);
    res.status(200).json({
      message:
        "A password reset token has been sent to your email. Please check your inbox and follow the instructions to reset your password.",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const resetAdminPasswordToken = expressAsyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new Error("Please fill in all the required fields.");
    }
    if (!emailValidator.validate(email)) {
      throw new Error("Please provide a valid email address.");
    }
    const user = await User.findOne({ email });
    if (!user)
      throw new Error("There is no account associated with this email.");

    if (user.role !== "admin") {
      throw new Error("Not authorised.");
    }
    const resetPasswordToken = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid 10 minutes from now. <a href='https://zeenet-adminapp.onrender.com/reset-password/${resetPasswordToken}'>Click Here</>`;
    const data = {
      to: email,
      text: "Zeenet e-commerce.",
      subject: "Password reset link",
      html: resetURL,
    };
    sendEmail(data);
    res.status(200).json({
      message:
        "A password reset token has been sent to your email. Please check your inbox and follow the instructions to reset your password.",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = expressAsyncHandler(async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      throw new Error("Please provide password.");
    }
    validatePassword(password);
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user)
      throw new Error(
        "Something went wrong. Please try initiating the password reset process again."
      );
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    throw new Error(error);
  }
});

const getWishlist = expressAsyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    validateMongodbId(_id);
    const cacheKey = `user:${_id}:wishlist`;
    const cachedWishlist = await redis.get(cacheKey);
    if (cachedWishlist) {
      return res.status(200).json(JSON.parse(cachedWishlist));
    }
    const user = await User.findById(_id).populate("wishlist");
    await redis.set(cacheKey, JSON.stringify(user), "EX", 2);
    res.status(200).json(user);
  } catch (error) {
    throw new Error(error);
  }
});

const adddProductToCart = expressAsyncHandler(async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;
    if (!productId || !quantity || !price) {
      throw new Error("Please provide all the required fileds.");
    }
    const { _id } = req.user;
    validateMongodbId(_id);
    let newCart = await new Cart({
      userId: _id,
      productId,
      quantity,
      price,
    }).save();
    res.status(200).json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = expressAsyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    if (!id) {
      throw new Error("Please provide a user Id.");
    }
    validateMongodbId(_id);
    const cacheKey = `cart:${_id}`;
    const cachedCart = await redis.get(cacheKey);
    if (cachedCart) {
      return res.status(200).json(JSON.parse(cachedCart));
    }
    const cart = await Cart.find({ userId: _id }).populate("productId");
    await redis.set(cacheKey, JSON.stringify(cart), "EX", 2);
    res.status(200).json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = expressAsyncHandler(async (req, res) => {
  try {
    const { coupon } = req.body;
    if (!coupon) {
      throw new Error("Please provide a user Id.");
    }
    const { _id } = req.user;
    validateMongodbId(_id);
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (validCoupon === null) {
      throw new Error("Coupon has expired.");
    }
    const user = await User.findOne({ _id });
    let { cartTotal } = await Cart.findOne({
      orderby: user._id,
    }).populate("products.product");
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    await Cart.findOneAndUpdate(
      { orderby: user._id },
      { totalAfterDiscount },
      { new: true }
    );
    res.status.json(totalAfterDiscount);
  } catch (error) {
    throw new Error(error);
  }
});

const createOrder = expressAsyncHandler(async (req, res) => {
  try {
    const {
      shippingInfo,
      orderedItems,
      totalPrice,
      totalPriceAfterDiscount,
      paymentInfo,
    } = req.body;

    if (
      !shippingInfo ||
      !orderedItems ||
      !totalPrice ||
      !totalPriceAfterDiscount ||
      !paymentInfo
    ) {
      throw new Error(
        "Please verify that you have provided all the order related information."
      );
    }
    const { _id } = req.user;
    validateMongodbId(_id);
    const order = await Order.create({
      shippingInfo,
      orderedItems,
      totalPrice,
      totalPriceAfterDiscount,
      paymentInfo,
      user: _id,
    });
    res.status.json({
      order,
      success: true,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getUserOrders = expressAsyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const cacheKey = `order:${_id}`;
    const cachedOrder = await redis.get(cacheKey);
    if (cachedOrder) {
      return res.status(200).json(JSON.parse(cachedOrder));
    }
    const orders = await Order.find({ user: _id })
      .populate("user")
      .populate("orderedItems.product");
    await redis.set(cacheKey, JSON.stringify(orders), "EX", 2);
    res.status(200).json({ orders });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllOrders = expressAsyncHandler(async (req, res) => {
  try {
    const cacheKey = "orders";
    const cachedOrders = await redis.get(cacheKey);
    if (cachedOrders) {
      return res.status(200).json(JSON.parse(cachedOrders));
    }
    const orders = await Order.find().populate("user");
    await redis.set(cacheKey, JSON.stringify(orders), "EX", 2);
    res.status(200).json({ orders });
  } catch (error) {
    throw new Error(error);
  }
});

const getASingleOrder = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const order = await Order.findOne({ _id: id }).populate(
      "orderedItems.product"
    );
    if (!order) {
      throw new Error("Order not found.");
    }
    res.status(200).json({ order });
  } catch (error) {
    throw new Error(error);
  }
});

const updateOrderStatus = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const order = await Order.findById(id);
    if (!order) {
      throw new Error("Order not found.");
    }
    const { status } = req.body;
    if (!status) {
      throw new Error("Select Order status.");
    }
    order.status = status;
    await order.save();
    res.status(200).json({ order });
  } catch (error) {
    throw new Error(error);
  }
});

const getMonthWiseOrderIncome = expressAsyncHandler(async (req, res) => {
  try {
    let monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let d = new Date();
    let endDate = "";
    d.setDate(1);
    for (let index = 0; index < 11; index++) {
      d.setMonth(d.getMonth() - 1);
      endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
    }
    const data = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $lte: new Date(),
            $gte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: { month: "$month" },
          amount: { $sum: "$totalPriceAfterDiscount" },
          count: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (error) {
    throw new Error(error);
  }
});

const getYearlyOrders = expressAsyncHandler(async (req, res) => {
  try {
    let monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let d = new Date();
    let endDate = "";
    d.setDate(1);
    for (let index = 0; index < 11; index++) {
      d.setMonth(d.getMonth() - 1);
      endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
    }
    const data = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $lte: new Date(),
            $gte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          amount: { $sum: "$totalPriceAfterDiscount" },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  registerUser,
  signInUser,
  getAllUsers,
  getAUser,
  deleteAUser,
  updateAUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  resetUserPasswordToken,
  resetPassword,
  adminSignIn,
  getWishlist,
  adddProductToCart,
  getUserCart,
  applyCoupon,
  createOrder,
  getUserOrders,
  getMonthWiseOrderIncome,
  getYearlyOrders,
  getAllOrders,
  getASingleOrder,
  updateOrderStatus,
  resetAdminPasswordToken,
};
