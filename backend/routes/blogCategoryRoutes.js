const express = require("express");
const {addABlogCategory,updateABlogCategory,deleteABlogCategory,getABlogCategory,getAllBlogCategories} = require("../controllers/blogCategoryCtrl");
const { verifyUserToken } = require("../middlewares/authMiddleware");
const { authorisedRoles } = require("../middlewares/roleMiddleware");
const router = express.Router();

router.post("/blogCategories",verifyUserToken, authorisedRoles("Admin", "Manager"), addABlogCategory);
router.patch("/:id/update", verifyUserToken, authorisedRoles("Admin", "Manager"), updateABlogCategory);
router.patch("/:id/delete", verifyUserToken, authorisedRoles("Admin", "Manager"), deleteABlogCategory);
router.get("/:id", getABlogCategory);
router.get("/blogCategories/all", getAllBlogCategories);

module.exports = router;
