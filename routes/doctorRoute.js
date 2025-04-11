const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.get("/search", doctorController.search);
router.put("/save", doctorController.savHistory);
router.get("/dashboard", doctorController.dashboard);

module.exports = router;