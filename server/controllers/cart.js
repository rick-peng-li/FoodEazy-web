const User = require("../models/user");

const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json(user.cart || {});
  } catch (err) {
    next(err);
  }
};

const saveCart = async (req, res, next) => {
  try {
    const { user_id, cart } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: user_id },
      { cart },
      { new: true }
    );
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json({ msg: "Cart saved" });
  } catch (err) {
    next(err);
  }
};

const clearCart = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      cart: { total_quantity: 0, total_price: 0, items: [] },
    });
    res.status(200).json({ msg: "Cart cleared" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, saveCart, clearCart };
