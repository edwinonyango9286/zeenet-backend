const Product = require("../models/productModel");
const User = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongodbId = require("../utils/validateMongodbId");
const redis = require("../utils/redis");
const cron = require("node-cron");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

// Generate productId
const generateProductCode = (prefix) => {
  const productCode = uuidv4();

  const hash = crypto.createHash("sha256").update(productCode).digest("hex");
  const shortProductCode = hash.substring(0, 8);
  return console.log(`${prefix}-${shortProductCode}`);
};

const createProduct = expressAsyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    validateMongodbId(_id);
    const {
      name,
      description,
      shortDescription,
      currentPrice,
      oldPrice,
      category,
      brand,
      quantity,
      images,
      tags,
      color,
    } = req.body;
    //Input validation
    if (
      !name ||
      !description ||
      !shortDescription ||
      !currentPrice ||
      !oldPrice ||
      !category ||
      !brand ||
      !quantity ||
      !images ||
      !tags ||
      !color
    ) {
      throw new Error("Please fill in all the required fields.");
    }
    const newProduct = await Product.create({
      ...req.body,
      slug: slugify(name),
      addedBy: _id,
      productCode: generateProductCode("PROD"),
    });
    return res.status(201).json({
      status: "SUCCESS",
      message: "Product added successfully.",
      newProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = expressAsyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      currentPrice,
      oldPrice,
      category,
      brand,
      quantity,
      images,
      tags,
    } = req.body;
    //Input validation
    if (
      !name ||
      !description ||
      !currentPrice ||
      !shortDescription ||
      !category ||
      !brand ||
      !quantity ||
      !images ||
      !tags
    ) {
      throw new Error("Please fill in all the required fields");
    }

    const { id } = req.params;
    validateMongodbId(id);
    if (title) {
      req.body.slug = slugify(title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateProduct) {
      throw new Error("Product not found.");
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//  delete a product => soft deletion
const deleteProduct = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const deletedProduct = await Product.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );
    if (!deletedProduct) {
      throw new Error("Product not found.");
    }

    const cacheKey = `product:${id}`;
    await redis.del(cacheKey);
    const productsCacheKeys = await redis.keys("products:*");
    for (const key of productsCacheKeys) {
      await redis.del(key);
    }
    res.status(200).json(deletedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getaProduct = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const cacheKey = `product:${id}`;
    const cachedProduct = await redis.get(cacheKey);
    if (cachedProduct) {
      return res.status(200).json(JSON.parse(cachedProduct));
    }
    const product = await Product.findById(id)
      .populate("brand")
      .populate("category");
    if (!product) {
      throw new Error("Product currently out of stock.");
    }
    await redis.set(cacheKey, JSON.stringify(product), "EX", 2);
    res.status(200).json(product);
  } catch (error) {
    throw new Error(error);
  }
});

const getallProducts = expressAsyncHandler(async (req, res) => {
  try {
    const queryObject = { ...req.query };
    // Exclude fields for pagination, sorting, etc.
    const excludeFields = ["page", "sort", "limit", "offset", "fields"];
    excludeFields.forEach((el) => delete queryObject[el]);

    // Add condition to filter out deleted products
    queryObject.isDeleted = false;
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Create the query
    let query = Product.find(JSON.parse(queryStr))
      .populate("category")
      .populate("brand");

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;
    query = query.skip(offset).limit(limit);

    // Caching
    const cacheKey = `products:${JSON.stringify(queryObject)}:${
      req.query.sort
    }:${req.query.fields}:${limit}:${offset}`;
    const cachedProducts = await redis.get(cacheKey);
    if (cachedProducts) {
      return res.status(200).json(JSON.parse(cachedProducts));
    }

    const products = await query;
    await redis.set(cacheKey, JSON.stringify(products), "EX", 2);
    res.status(200).json(products);
  } catch (error) {
    throw new Error(error);
  }
});

const addToWishlist = expressAsyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const { productId } = req.body;
    if (!req.user || !_id) {
      throw new Error("Please login to proceed.");
    }
    if (!productId) {
      throw new Error("Product currently out of stock.");
    }
    validateMongodbId(_id);
    validateMongodbId(productId);
    const user = await User.findById(_id);
    const alreadyadded = user.wishlist.find(
      (id) => id.toString() === productId
    );
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: productId },
        },
        {
          new: true,
        }
      );
      const userWishlist = await User.findById(_id).populate("wishlist");
      const cacheKey = `user:${_id}:wishlist`;
      await redis.set(cacheKey, JSON.stringify(userWishlist), "EX", 2);
      res.status(200).json(userWishlist);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: productId },
        },
        {
          new: true,
        }
      );
      const userWishlist = await User.findById(_id).populate("wishlist");
      const cacheKey = `user:${_id}:wishlist`;
      await redis.set(cacheKey, JSON.stringify(userWishlist), "EX", 2);

      res.status(200).json(userWishlist);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const rating = expressAsyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const { star, prodId, ratingComment } = req.body;
    validateMongodbId(_id);
    validateMongodbId(prodId);
    if (!star || !ratingComment) {
      throw new Error(
        "Please provide a rating and rating comment for this product."
      );
    }

    // Transform the ratingComment
    const formattedRatingComment = ratingComment.replace(
      /(^\w{1}|\.\s*\w{1})/g,
      (char) => char.toUpperCase()
    );

    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (rating) => rating.postedBy.toString() === _id.toString()
    );

    if (alreadyRated) {
      await Product.updateOne(
        { _id: prodId, "ratings._id": alreadyRated._id },
        {
          $set: {
            "ratings.$.star": star,
            "ratings.$.ratingComment": formattedRatingComment,
          },
        },
        { new: true }
      );
    } else {
      await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              ratingComment: formattedRatingComment,
              postedBy: _id,
            },
          },
        },
        { new: true }
      );
    }

    const getallratings = await Product.findById(prodId);
    const totalrating = getallratings.ratings.length;
    const ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    const actualRating = Math.round(ratingsum / totalrating);

    const finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      {
        new: true,
      }
    );

    res.status(200).json(finalproduct);
  } catch (error) {
    throw new Error(error.message);
  }
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
