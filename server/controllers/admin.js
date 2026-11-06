const path = require("path");
const Product = require("../models/product");
const User = require("../models/user");
const upload = require("../middleware/upload");
const { useCloudinary, uploadImage } = require("../services/cloudinary");

const listAdminItems = async (req, res, next) => {
  try {
    const items = await Product.find({});
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

const addProduct = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ msg: err.message });
    if (!req.file) return res.status(400).json({ msg: "Image is required" });

    try {
      const admin = await User.findById(req.user.id);
      if (!admin || admin.role !== "admin") {
        return res.status(403).json({ msg: "Only admins can add items" });
      }

      const { name, price, type } = req.body;
      const exists = await Product.findOne({ name });
      if (exists) return res.status(400).json({ msg: "Product already exists" });

      let url = `/images/${path.basename(req.file.path)}`;
      if (useCloudinary) {
        url = await uploadImage(req.file.path);
      }

      const product = new Product({ type, name, price, url });
      await product.save();
      res.status(200).json({ msg: "Item saved successfully" });
    } catch (err) {
      next(err);
    }
  });
};

const deleteProduct = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ msg: "Only admins can delete items" });
    }
    const { name } = req.body;
    const result = await Product.deleteOne({ name });
    res.status(200).json({ deletedCount: result.deletedCount });
  } catch (err) {
    next(err);
  }
};

module.exports = { listAdminItems, addProduct, deleteProduct };
