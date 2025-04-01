const expressAsyncHandler = require("express-async-handler");
const Color = require("../models/colorModel");
const _ = require("lodash");
const validateMongodbId = require("../utils/validateMongodbId");

// add a new color
const addAColor = expressAsyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      throw new Error("Please provide all the required fields.");
    }
    // check if the color already exist =>case insensitive search
    const existingColor = await Color.findOne({
      name: new RegExp(`^${name}`, "i"),
    });

    if (existingColor) {
      throw new Error("A color with a similar name already exist.");
    }
    const addedColor = await Color.create({
      ...req.body,
      addedBy: req?.user?._id,
      name: _.capitalize(name),
      description: _.capitalize(description),
    });
    return res.status(201).json({
      status: "SUCCESS",
      message: "Color added successfully.",
      data: addedColor,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// get a color by users
const getAColorByIdUsers = expressAsyncHandler(async (req, res) => {
  try {
    const { colorId } = req.params;
    validateMongodbId(colorId);
    const color = await Color.findOne({
      _id: colorId,
      isDeleted: false,
      visibility: "Published",
    });
    if (!color) {
      throw new Error("color not found.");
    }
    return res.status(200).json({ status: "SUCCESS", data: color });
  } catch (error) {
    throw new Error(error);
  }
});

// get A color by id admin
const getAColorByIdAdmin = expressAsyncHandler(async (req, res) => {
  try {
    const { colorId } = req.params;
    const color = await Color.findOne({
      _id: colorId,
      addedBy: req.user._id,
      isDeleted: false,
    });
    if (!color) {
      throw new Error("Color not found.");
    }
    return res.status(200).json({ status: "SUCCESS", data: color });
  } catch (error) {
    throw new Error(error);
  }
});

// Get all colors by users => users will only see colors whose
const getAllColors = expressAsyncHandler(async (req, res) => {
  try {
    const colors = await Color.find({
      isDeleted: false,
      visibility: "Published",
    });
    return res.status(200).json({ status: "SUCCESS", data: colors });
  } catch (error) {
    throw new Error(error);
  }
});




module.exports = {
  addAColor,
  getAllColors,
  getAColorByIdUsers,
  getAColorByIdAdmin,
};
