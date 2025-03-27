const express = require("express");
const {registerUser,signInUser,registerAdmin,signInAdmin,refreshAccessToken,logout, registerManager, signInManager} = require("../controllers/authCtrl");
const router = express.Router();

router.post("/user-register", registerUser);
router.post("/user-signin", signInUser);
router.post("/admin-register", registerAdmin);
router.post("/admin-signin", signInAdmin);
router.post("/manager-register", registerManager);
router.post("/manager-signin", signInManager)


router.get("/refresh-access-token", refreshAccessToken);
router.put("/logout", logout);

module.exports = router;
