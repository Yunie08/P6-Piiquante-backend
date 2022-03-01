const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user');
// const signupValidation = require('../middleware/signup-validation');
const dataValidation = require('../middleware/dataValidation');

// router.post('/signup', signupValidation, userCtrl.signup);
router.post(
  '/signup',
  dataValidation.validateInput(dataValidation.userRules),
  userCtrl.signup
);
router.post('/login', userCtrl.login);

module.exports = router;
