const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.get("/search", doctorController.search);
router.put("/save", doctorController.savHistory);
router.get("/dashboard", doctorController.dashboard);
router.get("/dailyAppointment", doctorController.dailyAppointment);

module.exports = router;