const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user');
const signupValidation = require('../middleware/signup-validation');

router.post('/signup', signupValidation, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
