const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const shortid = require("shortid");
const User = require("../models/user");
const Forget = require("../models/forget");
const { sendMail, useSendGrid } = require("../services/mail");

const jwtSecret = process.env.JWT_SECRET || "food_eazy_dev_secret";
const publicBaseUrl = process.env.PUBLIC_BASE_URL || "http://localhost:5050";

const signToken = (id) =>
  jwt.sign({ id }, jwtSecret, { expiresIn: "7d" });

const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, number, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      number,
      password: hashed,
      uid: shortid.generate(),
      verify: false,
    });

    if (!useSendGrid) {
      user.verify = true;
      console.log(`[dev] verification code for ${email}: ${user.uid}`);
    } else {
      await sendMail({
        to: email,
        subject: "Food Eazy - Email Verification",
        html: `<h2>Your verification code is: <strong>${user.uid}</strong></h2>`,
      });
    }

    await user.save();
    const token = signToken(user.id);
    res.status(200).json({ token, verify: user.verify });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    const token = signToken(user.id);
    res.status(200).json({ token, verify: user.verify, role: user.role });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const verify = async (req, res, next) => {
  const { uid } = req.body;
  try {
    const user = await User.findOne({ uid });
    if (!user) return res.status(400).json({ msg: "Invalid verification code" });
    user.verify = true;
    await user.save();
    res.status(200).json({ msg: "Verified Successfully" });
  } catch (err) {
    next(err);
  }
};

const resendCode = async (req, res, next) => {
  const { id } = req.body;
  try {
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const uid = shortid.generate();
    user.uid = uid;
    await user.save();

    if (!useSendGrid) {
      console.log(`[dev] verification code for ${user.email}: ${uid}`);
    } else {
      await sendMail({
        to: user.email,
        subject: "Food Eazy - Resend Verification Code",
        html: `<h2>Your verification code is: <strong>${uid}</strong></h2>`,
      });
    }
    res.status(200).json({ msg: "Verification code sent" });
  } catch (err) {
    next(err);
  }
};

const forget = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not registered" });

    const code = shortid.generate();
    const forget = new Forget({ email, code });
    await forget.save();

    const link = `${publicBaseUrl}/forget/${code}`;
    await sendMail({
      to: email,
      subject: "Food Eazy - Reset Password",
      html: `Click <a href="${link}">here</a> to reset your password.`,
    });
    if (!useSendGrid) console.log(`[dev] reset link: ${link}`);
    res.status(200).json({ msg: "Reset email sent" });
  } catch (err) {
    next(err);
  }
};

const checkResetCode = async (req, res, next) => {
  try {
    const record = await Forget.findOne({ code: req.query.code });
    if (!record) return res.status(400).json({ msg: "Invalid or expired link" });
    res.status(200).json({ msg: "Link valid" });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  const { code, password } = req.body;
  try {
    const record = await Forget.findOne({ code });
    if (!record) return res.status(400).json({ msg: "Invalid link" });

    const user = await User.findOne({ email: record.email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    await Forget.deleteOne({ code });

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
  verify,
  resendCode,
  forget,
  checkResetCode,
  resetPassword,
};
