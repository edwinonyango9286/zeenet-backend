const User = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");
const validatePassword = require("../utils/validatePassword");
const sendEmail = require("./emailCtrl");
const { generateAccessToken } = require("../config/accessToken");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const emailValidator = require("email-validator");
const ejs = require("ejs");
const path = require("path");
const _ = require("lodash")

//register customer
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
        "This email address is already associated with an account. Please double check your email address and try again."
      );
    }
    const createdUser = await User.create({ ...req.body, firstName: _.startCase(firstName) , lastName:_.startCase(lastName), otherNames: _.startCase(otherNames) , role: "User" });
    // send an email confirmation for account creation.
    if (createdUser) {
      const userData = {
        createdUser: {
          name: `${firstName} ${lastName}`,
        },
      };
      const htmlContent = await ejs.renderFile(
        path.join(
          __dirname,
          "../mail-templates/accountCreationConfirmation.ejs"
        ),
        userData
      );
      const data = {
        to: createdUser?.email,
        subject: "Account creation confirmation",
        text: "Zeenet e-commerce",
        html: htmlContent,
      };
      await sendEmail(data);
    }
    // return user without password.
    const userWithoutPassword = await User.findById(createdUser?._id).select(
      "-password"
    );
    return res.status(200).json({
      status: "SUCCESS",
      message: "Account created successfully.",
      data: userWithoutPassword,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// register admin
const registerAdmin = expressAsyncHandler(async (req, res) => {
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
        "This email address is already associated with an account. Please double check your email address and try again."
      );
    }
    const createdUser = await User.create({ ...req.body, firstName: _.startCase(firstName) , lastName:_.startCase(lastName), otherNames: _.startCase(otherNames), role: "Admin" });
    // send an email confirmation for account creation.

    if (createdUser) {
      const userData = {
        createdUser: { name: `${firstName} ${lastName}` },
      };
      const htmlContent = await ejs.renderFile(
        path.join(
          __dirname,
          "../mail-templates/accountCreationConfirmation.ejs"
        ),
        userData
      );
      const data = {
        to: createdUser?.email,
        subject: "Account creation confirmation",
        text: "Zeenet e-commerce",
        html: htmlContent,
      };
      await sendEmail(data);
    }
    // return user without password.
    const userWithoutPassword = await User.findById(createdUser?._id).select(
      "-password"
    );
    return res.status(201).json({
      status: "SUCCESS",
      message: "Account created successfully.",
      data: userWithoutPassword,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//register admin
const registerManager = expressAsyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, otherNames } = req.body;
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
        "This email address is already associated with an account. Please double check your email address and try again."
      );
    }
    const createdUser = await User.create({ ...req.body, firstName: _.startCase(firstName) , lastName:_.startCase(lastName), otherNames: _.startCase(otherNames), role: "Manager" });
    // send an email confirmation for account creation.
    if (createdUser) {
      const userData = {
        createdUser: { name: `${firstName} ${lastName}` },
      };
      const htmlContent = await ejs.renderFile(
        path.join(
          __dirname,
          "../mail-templates/accountCreationConfirmation.ejs"
        ),
        userData
      );
      const data = {
        to: createdUser?.email,
        subject: "Account creation confirmation",
        text: "Zeenet e-commerce",
        html: htmlContent,
      };
      await sendEmail(data);
    }
    // return user without password.
    const userWithoutPassword = await User.findById(createdUser?._id).select(
      "-password"
    );
    return res.status(201).json({
      status: "SUCCESS",
      message: "Account created successfully.",
      data: userWithoutPassword,
    });
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
    if (user.role !== "User") {
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
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);
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
const signInAdmin = expressAsyncHandler(async (req, res) => {
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
    if (user.role !== "Admin") {
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
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      accessToken: accessToken,
    });
  } catch (error) {
    throw new Error(error);
  }
});


const signInManager = expressAsyncHandler(async (req, res) => {
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
    if (user.role !== "Manager") {
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
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      accessToken: accessToken,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const refreshAccessToken = expressAsyncHandler(async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie.refreshToken) {
      // if there is not token in cookies this means that the user had already logged out or the refresh token has expired from the cookies
      // The user should log in again to get a new access token
      throw new Error("Session expired. Please log in to proceed.");
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
        throw new Error("Invalid refresh token. Please login to proceed.");
      }
      const accessToken = generateAccessToken(user._id);
      req.user = user;
      return accessToken;
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

module.exports = {
  registerUser,
  registerAdmin,
  signInUser,
  signInAdmin,
  registerManager,
  signInManager,
  refreshAccessToken,
  logout,
};
