const express = require("express");
const auth = require("../middleware/auth");
const { createOrder, getOrderById } = require("../controllers/order");

const router = express.Router();

router.post("/", auth, createOrder);
router.get("/", getOrderById);

module.exports = router;
