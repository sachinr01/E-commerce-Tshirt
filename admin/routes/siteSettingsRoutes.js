const express = require("express");
const router  = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const { showSettings, saveSettings } = require("../controllers/siteSettingsController");

router.get("/site-settings",  isAuthenticated, showSettings);
router.post("/site-settings", isAuthenticated, saveSettings);

module.exports = router;