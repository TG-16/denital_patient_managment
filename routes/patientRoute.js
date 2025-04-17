const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.get("/history", patientController.getHistory); 
router.get("/doctors", patientController.getDoctors); 
router.post("/book", patientController.book);
router.delete("/cancel", patientController.cancel);
router.put("/rating", patientController.rating);

module.exports = router;
