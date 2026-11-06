const crypto = require("crypto");
const Order = require("../models/order");
const User = require("../models/user");
const { sendMail } = require("../services/mail");

const createOrder = async (req, res, next) => {
  const { value, cart, address, deliveryCharges, payment, user: buyer } = req.body;
  const order_id = crypto.randomBytes(16).toString("hex");

  try {
    const order = new Order({
      user: req.user.id,
      order_id,
      mode: value,
      order: cart,
      deliveryCharges,
      payment,
      ...(value === "Delivery" ? { address } : {}),
    });
    await order.save();

    if (buyer?.email) {
      await sendMail({
        to: buyer.email,
        subject: "Order Confirmation - Food Eazy",
        html: `Hi <strong>${buyer.name || ""}</strong>,<h2>Order Successfully Placed!</h2><p>Your order id: ${order_id}</p><p>Regards,<br>Food Eazy</p>`,
      });
    }

    await User.findByIdAndUpdate(req.user.id, {
      cart: { total_quantity: 0, total_price: 0, items: [] },
    });

    res.status(200).json({ orderid: order_id });
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ order_id: req.query.orderid }).populate(
      "user",
      "name email number"
    );
    if (!order) return res.status(404).json({ msg: "Order not found" });
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ time: -1 });
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, getOrderById, getMyOrders };
