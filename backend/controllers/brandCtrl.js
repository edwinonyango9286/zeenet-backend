const Brand = require("../models/brandModel");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createBrand = expressAsyncHandler(async (req, res) => {
  const newBrand = await Brand.create(req.body);
  res.json(newBrand);
});

const updateBrand = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json(updatedBrand);
});

const deleteBrand = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const deleteaBrand = await Brand.findByIdAndDelete(id);
  res.json(deleteaBrand);
});

const getBrand = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const getaBrand = await Brand.findById(id);
  res.json(getaBrand);
});

const getallBrands = expressAsyncHandler(async (req, res) => {
  const getallBrands = await Brand.find();
  res.json(getallBrands);
});

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getallBrands,
};
