// Import and setup express app
const express = require("express");
const app = express({ limit: "50mb" });

// Import and setup middlewares
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Import and setup routes
const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoutes");
const blogRouter = require("./routes/blogRoute");
const productCategoryRouter = require("./routes/productCategoryRoute");
const blogCatRouter = require("./routes/blogCatRoute");
const BrandRouter = require("./routes/brandRoute");
const couponRouter = require("./routes/couponRoute");
const enquiryRouter = require("./routes/enqRoute");
const uploadRouter = require("./routes/uploadRoute");

app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/productcategory", productCategoryRouter);
app.use("/api/blogcategory", blogCatRouter);
app.use("/api/productbrand", BrandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/enquiry", enquiryRouter);
app.use("/api/upload", uploadRouter);

// Export the app
module.exports = app;
