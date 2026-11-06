const express = require("express");
const auth = require("../middleware/auth");
const { listAdminItems, addProduct, deleteProduct } = require("../controllers/admin");

const router = express.Router();

router.get("/items", listAdminItems);
router.post("/upload", auth, addProduct);
router.post("/items", auth, deleteProduct);

module.exports = router;
