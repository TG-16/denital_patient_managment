const express = require('express');
const router = express.Router();
const receptionController = require('../controllers/receptionController');

router.get("/todaysAppointments", receptionController.todaysAppointments);
router.get("/doctors",  receptionController.getDoctors);
router.post("/book", receptionController.book);
router.delete("/cancel", receptionController.cancel);


module.exports = router;
