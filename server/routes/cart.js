const express = require("express");
const auth = require("../middleware/auth");
const { getCart, saveCart, clearCart } = require("../controllers/cart");

const router = express.Router();

router.get("/", auth, getCart);
router.post("/", saveCart);
router.put("/", auth, clearCart);

module.exports = router;
