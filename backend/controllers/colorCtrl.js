const expressAsyncHandler = require("express-async-handler");
const Color = require("../models/colorModel");

const addAColor = expressAsyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new Error("Please provide color name.");
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
      addedBy: req.user._id,
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

module.exports = { addAColor };
