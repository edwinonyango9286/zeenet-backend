const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const Town = require("../models/townModel");

const createTown = expressAsyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new Error("Please provide all the required fields");
    }
    const newTown = await Town.create(req.body);
    res.status(201).json(newTown);
  } catch (error) {
    throw new Error(error);
  }
});

const updateTown = expressAsyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new Error("Please provide all the required fields.");
    }
    const { id } = req.params;
    validateMongodbId(id);
    const updatedTown = await Town.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedTown) {
      throw new Error("Town not found.");
    }
    res.status(200).json(updatedTown);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteTown = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const deletedTown = await Town.findByIdAndDelete(id);
    if (!deletedTown) {
      throw new Error("Town not found.");
    }
    res.status(200).json(deletedTown);
  } catch (error) {
    throw new Error(error);
  }
});

const getTown = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const town = await Town.findById(id);
    if (!town) {
      throw new Error("Town not found.");
    }
    res.status(200).json(town);
  } catch (error) {
    throw new Error(error);
  }
});

const getallTowns = expressAsyncHandler(async (req, res) => {
  try {
    const towns = await Town.find();
    res.status(200).json(towns);
  } catch (error) {
    throw new Error(error);
  }
});


module.exports = {
  createTown,
  updateTown,
  deleteTown,
  getTown,
  getallTowns,
};
