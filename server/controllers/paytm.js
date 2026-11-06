const crypto = require("crypto");
const Order = require("../models/order");
const User = require("../models/user");
const checksum_lib = require("../paytm/checksum");
const { sendMail } = require("../services/mail");

const merchantId = process.env.PAYTM_MERCHANT_ID || process.env.MERCHANT_ID;
const merchantKey = process.env.PAYTM_MERCHANT_API_KEY || process.env.MERCHANT_API_KEY;
const publicBaseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:5050";

const initiatePayment = (req, res) => {
  if (!merchantId || !merchantKey) {
    return res
      .status(400)
      .json({ msg: "PayTM is not configured. Please choose Cash on Delivery." });
  }

  const order_id = crypto.randomBytes(16).toString("hex");
  const params = {
    MID: merchantId,
    WEBSITE: "WEBSTAGING",
    CHANNEL_ID: "WEB",
    INDUSTRY_TYPE_ID: "Retail",
    ORDER_ID: order_id,
    CUST_ID: req.user.id,
    TXN_AMOUNT: req.body.amount?.toString() || "0",
    CALLBACK_URL: `${publicBaseUrl}/api/paytm/success`,
  };

  checksum_lib.genchecksum(params, merchantKey, (err, checksum) => {
    if (err) return res.status(500).json({ msg: "Checksum generation failed" });
    const txn_url =
      process.env.PAYTM_TXN_URL || "https://securegw-stage.paytm.in/order/process";
    let formFields = "";
    Object.entries(params).forEach(
      ([k, v]) => (formFields += `<input type="hidden" name="${k}" value="${v}">`)
    );
    formFields += `<input type="hidden" name="CHECKSUMHASH" value="${checksum}">`;
    const html = `<html><head><title>Merchant Checkout</title></head><body><center><h1>Please do not refresh...</h1></center><form method="post" action="${txn_url}" name="f1">${formFields}</form><script type="text/javascript">document.f1.submit();</script></body></html>`;
    res.status(200).send(html);
  });
};

const paymentSuccess = async (req, res) => {
  try {
    const body = req.body;
    const order = await Order.findOne({ order_id: body.ORDERID });
    if (!order) return res.redirect(`${publicBaseUrl}/fail`);

    order.status = body.STATUS || "success";
    await order.save();

    const user = await User.findById(order.user);
    if (user?.email) {
      await sendMail({
        to: user.email,
        subject: "Order Confirmation - Food Eazy",
        html: `Hi <strong>${user.name}</strong>,<h2>Order Paid Successfully!</h2><p>Order id: ${order.order_id}</p>`,
      });
    }

    await User.findByIdAndUpdate(order.user, {
      cart: { total_quantity: 0, total_price: 0, items: [] },
    });

    res.redirect(`${publicBaseUrl}/success?orderid=${body.ORDERID}`);
  } catch (err) {
    console.error(err);
    res.redirect(`${publicBaseUrl}/fail`);
  }
};

module.exports = { initiatePayment, paymentSuccess };
