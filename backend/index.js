const express = require("express");
const connect = require("./config/databaseConnection");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoute");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const productRouter = require("./routes/productRoutes");
const morgan = require("morgan");
const blogRouter = require("./routes/blogRoute");
const productCategoryRouter = require("./routes/productCategoryRoute");
const blogCatRouter = require("./routes/blogCatRoute");
const BrandRouter = require("./routes/brandRoute");
const couponRouter = require("./routes/couponRoute");
const enquiryRouter = require("./routes/enqRoute");
const uploadRouter = require("./routes/uploadRoute");
const cors = require("cors");

const app = express();
connect();
app.use(morgan("dev"));
app.use(cors());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://zeenet-frontstore.onrender.com",
      "https://zeenet-adminapp.onrender.com",
    ],
  })
); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", authRouter);
app.use("/api/products", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/productcategory", productCategoryRouter);
app.use("/api/blogcategory", blogCatRouter);
app.use("/api/productbrand", BrandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/enquiry", enquiryRouter);
app.use("/api/upload", uploadRouter);

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running  at PORT ${PORT}`);
});
