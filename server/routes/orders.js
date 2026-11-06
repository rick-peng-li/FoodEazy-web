const express = require("express");
const auth = require("../middleware/auth");
const { getMyOrders } = require("../controllers/order");

const router = express.Router();

router.get("/", auth, getMyOrders);

module.exports = router;
