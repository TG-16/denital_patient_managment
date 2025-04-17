const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

//ruth
router.delete("/delete", adminController.deleteUser);
router.get("/getDoctors", adminController.getDoctors);
router.get("/getPatients", adminController.getPatients);
router.get("/getReceptions", adminController.getReceptions);

//hebron's work
router.post("/login", adminController.login);


module.exports = router;
