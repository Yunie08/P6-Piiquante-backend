const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user');
const signupValidation = require('../middleware/signup-validation');
const encryptEmail = require('../middleware/encryptEmail');

router.post('/signup', signupValidation, encryptEmail, userCtrl.signup);
router.post('/login', encryptEmail, userCtrl.login);

module.exports = router;
