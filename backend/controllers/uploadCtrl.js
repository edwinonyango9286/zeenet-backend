const fs = require("fs")
const expressAsyncHandler = require("express-async-handler");
const { cloudinaryDeleteImg, cloudinaryUploadImg } = require("../utils/cloudinary");

const uploadImages = expressAsyncHandler(async (req, res) => {
  const uploader = (path) => cloudinaryUploadImg(path, "images");
  const urls = [];
  const files = req.files;
  for (const file of files) {
    const { path } = file;
    const newpath = await uploader(path);
    urls.push(newpath);
    fs.unlinkSync(path);
  }
  const images = urls.map((file) => {
    return file;
  });
  res.json(images);
}); 

const deleteImages = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = cloudinaryDeleteImg(id, "images");
  res.json({ message: "Image deleted successfully" });
});


module.exports={
    uploadImages,
    deleteImages
}
