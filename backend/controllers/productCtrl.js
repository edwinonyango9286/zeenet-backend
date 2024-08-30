const Product = require("../models/productModel");
const User = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongodbId = require("../utils/validateMongodbId");

const createProduct = expressAsyncHandler(async (req, res) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const newProduct = await Product.create(req.body);
  res.json(newProduct);
});

const updateProduct = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json(updatedProduct);
});

const deleteProduct = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const deleteProduct = await Product.findOneAndDelete({ _id: id });
  res.json(deleteProduct);
});

const getaProduct = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const findProduct = await Product.findById(id);
  res.json(findProduct);
});

const getallProducts = expressAsyncHandler(async (req, res) => {
  // Filtering

  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "offset", "fields"];
  excludeFields.forEach((el) => delete queryObj[el]);
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  let query = Product.find(JSON.parse(queryStr));
  // sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  // Limiting fields
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }
  // Pagination
  const limit = parseInt(req.query.limit, 20) || 20;
  const offset = parseInt(req.query.offset) || 0;
  query = query.skip(offset).limit(limit);
  const products = await query;
  res.json(products);
});

const addToWishlist = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  if (!req.user || !_id) {
    throw new Error("Please login to proceed.");
  }
  if (!prodId) {
    throw new Error("Product currently out of stock.");
  }
  validateMongodbId(_id);
  validateMongodbId(prodId);

  const user = await User.findById(_id);
  const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
  if (alreadyadded) {
    let user = await User.findByIdAndUpdate(
      _id,
      {
        $pull: { wishlist: prodId },
      },
      {
        new: true,
      }
    );
    res.json(user);
  } else {
    let user = await User.findByIdAndUpdate(
      _id,
      {
        $push: { wishlist: prodId },
      },
      {
        new: true,
      }
    );
    res.json(user);
  }
});

const rating = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  validateMongodbId(_id);
  validateMongodbId(prodId);
  if (!star || !comment) {
    throw new Error("Please provide rating and comment for this product.");
  }
  const product = await Product.findById(prodId);
  let alreadyRated = product.ratings.find(
    (userId) => userId.postedby.toString() === _id.toString()
  );
  if (alreadyRated) {
    const updateRating = await Product.updateOne(
      { ratings: { $elemMatch: alreadyRated } },
      {
        $set: { "ratings.$.star": star, "ratings.$.comment": comment },
      },
      { new: true }
    );
  } else {
    const rateProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        $push: {
          ratings: {
            star: star,
            comment: comment,
            postedby: _id,
          },
        },
      },
      { new: true }
    );
  }

  const getallratings = await Product.findById(prodId);
  let totalrating = getallratings.ratings.length;
  let ratingsum = getallratings.ratings
    .map((item) => item.star)
    .reduce((prev, curr) => prev + curr, 0);
  let actualRating = Math.round(ratingsum / totalrating);
  let finalproduct = await Product.findByIdAndUpdate(
    prodId,
    {
      totalrating: actualRating,
    },
    {
      new: true,
    }
  );
  res.json(finalproduct);
});

module.exports = {
  createProduct,
  getallProducts,
  getaProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
};
