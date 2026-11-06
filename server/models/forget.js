const mongoose = require("mongoose");

const forgetSchema = new mongoose.Schema({
  email: { type: String },
  code: { type: String },
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("forget", forgetSchema);
