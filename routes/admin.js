const express = require("express");
const path = require("path");
const upload = require("../controllers/upload");
const Router = express.Router();
const Product = require("../models/product");
const User = require("../models/register");
const Cloudinary = require("cloudinary");
const auth = require("../middleware/auth");
const config = require("config");

const cloudName = config.get("cloud_name");
const apiKey = config.get("api_key");
const apiSecret = config.get("api_secret");
const useCloudinary = cloudName && apiKey && apiSecret;

if (useCloudinary) {
  Cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

Router.post("/upload", auth, async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.status(400).json(err);
    } else {
      let user = await User.findOne({ _id: req.user.id });
      if (user.role !== "admin")
        return res
          .status(401)
          .json(
            "Your request was processed but only admins are allowed to add or remove items!"
          );
      let product = await Product.findOne({
        name: req.body.name,
      });

      if (product) return res.status(400).json("Product already exists!");

      try {
        let imageUrl = `/images/${path.basename(req.file.path)}`;
        if (useCloudinary) {
          const result = await new Promise((resolve, reject) => {
            Cloudinary.v2.uploader.upload(req.file.path, (error, result) =>
              error ? reject(error) : resolve(result)
            );
          });
          imageUrl = result.url;
        }
        product = new Product({
          type: req.body.type,
          name: req.body.name,
          price: req.body.price,
          url: imageUrl,
        });
        await product.save();
        return res.status(200).json("Item Saved Successfully!");
      } catch (e) {
        console.log(e);
        res.status(500).send("Server Error");
      }
    }
  });
});

Router.get("/items", async (req, res) => {
  Product.find({}, (err, items) => {
    if (err) res.status(400).json(err);
    res.status(200).json(items);
  });
});

Router.post("/items", auth, async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    if (user.role !== "admin")
      return res
        .status(401)
        .json(
          "Your request was processed but only admins are allowed to add or remove items!"
        );
    const item = await Product.deleteOne({
      name: req.body.name,
    });
    res.status(200).send(item);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
module.exports = Router;
