const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    q: { type: Number, required: true },
    url: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "auth", required: true },
  order_id: { type: String },
  mode: { type: String, required: true },
  order: {
    total_quantity: { type: Number, default: 0 },
    total_price: { type: Number, default: 0 },
    items: { type: [orderItemSchema], default: [] },
  },
  deliveryCharges: { type: Number, default: 0 },
  status: { type: String, default: "pending" },
  address: { type: Object },
  payment: { type: String },
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("orders", orderSchema);
