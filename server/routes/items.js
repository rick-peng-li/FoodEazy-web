const express = require("express");
const { listItems } = require("../controllers/items");

const router = express.Router();

router.get("/", listItems);

module.exports = router;
