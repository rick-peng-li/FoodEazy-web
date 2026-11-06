const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["Veg", "nonVeg"] },
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  url: { type: String, required: true },
});

module.exports = mongoose.model("product", productSchema);
