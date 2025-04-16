const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

router.post('/register', indexController.register);
router.post("/login", indexController.login);

module.exports = router;