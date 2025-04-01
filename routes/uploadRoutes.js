const express = require("express")
const { uploadImages, deleteImages } = require("../controllers/uploadCtrl")
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImage");
const router = express.Router();

router.post("/",uploadPhoto.array("images",10),productImgResize,uploadImages);
router.delete("/delete/:id",deleteImages);

module.exports = router;

