const express = require("express");
const auth = require("../middleware/auth");
const { initiatePayment, paymentSuccess } = require("../controllers/paytm");

const router = express.Router();

router.post("/", auth, initiatePayment);
router.post("/success", paymentSuccess);

module.exports = router;
