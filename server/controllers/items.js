const Product = require("../models/product");

const listItems = async (req, res, next) => {
  try {
    const items = await Product.find({});
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
};

module.exports = { listItems };
