const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const {
  register,
  login,
  getMe,
  verify,
  resendCode,
  forget,
  checkResetCode,
  resetPassword,
} = require("../controllers/auth");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").not().isEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("number").isNumeric().isLength({ min: 10 }).withMessage("Valid number is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").exists().withMessage("Password is required"),
  ],
  login
);

router.get("/login", auth, getMe);
router.post("/verify", verify);
router.post("/resend", resendCode);
router.post("/forget", forget);
router.get("/reset", checkResetCode);
router.post("/reset", resetPassword);

module.exports = router;
