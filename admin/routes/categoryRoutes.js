const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const categoryController = require("../controllers/categoryController");

// ✅ All routes consistent — no /store/admin prefix in controller redirects
router.get("/products/categories", isAuthenticated, categoryController.index);
router.post("/product/category/store", isAuthenticated, categoryController.store);
router.post("/product/category/update/:id", isAuthenticated, categoryController.update);
router.get("/product/category/delete/:id", isAuthenticated, categoryController.delete);

module.exports = router;