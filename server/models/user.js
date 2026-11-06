const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    q: { type: Number, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  uid: { type: String, default: "" },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  verify: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  number: { type: Number, required: true },
  password: { type: String, required: true },
  cart: {
    total_quantity: { type: Number, default: 0 },
    total_price: { type: Number, default: 0 },
    items: { type: [cartItemSchema], default: [] },
  },
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("auth", userSchema);
