const express = require("express")
const { verifyUserToken } = require("../middlewares/authMiddleware")
const { authorisedRoles } = require("../middlewares/roleMiddleware");
const { createAProductParentCategory, updateAProductParentCategory, deleteAProductParentCategory, getAProductParentCategory, getAllProductParentCategories } = require("../controllers/productParentCategoryCtrl");


const router = express.Router();

router.post("/", verifyUserToken, authorisedRoles("Admin", "Manager"),createAProductParentCategory);
router.get("/:id", getAProductParentCategory )
router.patch("/:id/update", verifyUserToken, authorisedRoles("Admin", "Manager"), updateAProductParentCategory);
router.patch("/:id/delete", verifyUserToken, authorisedRoles("Admin", "Manager"), deleteAProductParentCategory)
router.get("/productParentCategories/all", getAllProductParentCategories)

module.exports = router;