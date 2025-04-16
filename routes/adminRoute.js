const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminControler');

router.get("/todaysAppointments", adminController.todaysAppointments);
router.delete("/delete", adminController.deleteUser);
router.get("/getDoctors", adminController.getDoctors);
router.get("/getPatients", adminController.getPatients);
router.get("/getReceptions", adminController.getReceptions);
router.post("/login", adminController.login);


module.exports = router;
