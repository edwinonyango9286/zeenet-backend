const Product = require("../models/productModel");
const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ejs = require("ejs");
const sendEmail = require("../controllers/emailCtrl");

const checkStockLevelCron = expressAsyncHandler(async (req, res) => {
  try {
    // get products with quantityInStock levels less than 5
    const productsWithQuantityInStockLessThan5 = await Product.find({
      quantityInStock: { $lt: 5 },
    });
    if (productsWithQuantityInStockLessThan5.length > 0) {
      // Get admin
      const admin = await User.findOne({ role: "admin" });
      if (admin) {
        // send email
        const adminData = {
          admin: { name: firstName },
          productsWithQuantityInStockLessThan5,
        };
        const htmlContent = await ejs.renderFile(
          Path.join(__dirname, "../mail-templates/lowStockLevelAlert.ejs"),
          adminData
        );
        const data = {
          to: admin?.email,
          subject: "Low Stock Level Alert",
          text: "Zeenet e-commerce",
          html: htmlContent,
        };
        await sendEmail(data);
      }
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { checkStockLevelCron };
