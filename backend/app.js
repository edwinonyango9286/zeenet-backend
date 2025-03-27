// Import and setup express app
const express = require("express");
const app = express();
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
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"],
  })
);

// Import and setup middlewares
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Import and setup routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const blogRouter = require("./routes/blogRoutes");
const productCategoryRouter = require("./routes/productCategoryRoutes");
const blogCategoryRouter = require("./routes/blogCategoryRoutes");
const BrandRouter = require("./routes/brandRoutes");
const couponRouter = require("./routes/couponRoutes");
const enquiryRouter = require("./routes/enquiryRoutes");
const uploadRouter = require("./routes/uploadRoutes");
const countryRouter = require("./routes/countryRoutes");
const townRouter = require("./routes/townRoutes");
const deliveryStationRouter = require("./routes/deliveryStationRoutes");
const countyRouter = require("./routes/countyRoutes");
const deliveryAddressRouter = require("./routes/deliveryAddressRoutes");
const paymentRouter = require("./routes/paymentRoutes");
const colorRouter = require("./routes/colorRoutes");

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/productCategories", productCategoryRouter);
app.use("/api/blogCategories", blogCategoryRouter);
app.use("/api/productBrands", BrandRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/enquiries", enquiryRouter);
app.use("/api/uploads", uploadRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/countries", countryRouter);
app.use("/api/counties", countyRouter);
app.use("/api/towns", townRouter);
app.use("/api/delivery-stations", deliveryStationRouter);
app.use("/api/delivery-addresses", deliveryAddressRouter);
app.use("/api/colors", colorRouter);

module.exports = app;
