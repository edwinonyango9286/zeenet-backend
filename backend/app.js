// Import and setup express app
const express = require("express");
const app = express({ limit: "50mb" });
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const origins = [
  process.env.ORIGIN_LOCALHOST_3000,
  process.env.ORIGIN_LOCALHOST_3001,
  process.env.ORIGIN_ZEENET_FRONTSTORE,
  process.env.ORIGIN_ZEENET_ADMINAPP,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origins.includes(origin)) {
        callback(null, { origin: origin, optionsSuccessStatus: 200 });
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"],
  })
);

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
const paymentRoute = require("./routes/paymentRoute");

app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/productcategory", productCategoryRouter);
app.use("/api/blogcategory", blogCatRouter);
app.use("/api/productbrand", BrandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/enquiry", enquiryRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/payment", paymentRoute);

module.exports = app;
