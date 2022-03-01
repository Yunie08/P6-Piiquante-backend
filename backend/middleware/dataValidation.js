const { check, validationResult } = require('express-validator');

exports.validateInput = (rules) => {
  return async (req, res, next) => {
    if (req.file) {
      req.body.sauce = JSON.parse(req.body.sauce);
    }
    await Promise.all(rules.map((rule) => rule.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
};

// exports.userRulesSchema = {
//   email: {
//     trim: true,
//     isEmpty: {
//       negated: true,
//       errorMessage: 'Please provide an email address',
//       bail: true,
//     },
//     normalizeEmail: true,
//     isEmail: {
//       errorMessage: 'Please provide a valid email address. ex: abc@example.com',
//     },
//   },
//   password: {
//     errorMessage:
//       'Password must contain 8+ characters, with at least 1 uppercase, 1 lowercase, 1 digit, 1 symbol and no blank space',
//     trim: true,
//     isEmpty: {
//       negated: true,
//       errorMessage: 'Please provide a password',
//       bail: true,
//     },
//     isStrongPassword: true,
//     contains: {
//       options: [[' ']],
//       negated: true,
//     },
//   },
// };

exports.userRules = [
  check('email')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please provide an email address')
    .bail()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please provide a valid email address. ex: abc@example.com'),
  check(
    'password',
    'Password must contain 8+ characters, with at least 1 uppercase, 1 lowercase, 1 digit, 1 symbol and no blank space'
  )
    .trim()
    .not()
    .isEmpty()
    .withMessage('Please provide a password')
    .bail()
    .isStrongPassword()
    .not()
    .contains(' '),
];

exports.sauceRules = [
  check('sauce.userId', 'A sauce must be created by a known user')
    .trim()
    .not()
    .isEmpty(),
  check('sauce.name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ min: 5, max: 30 })
    .withMessage('Name must be between 5 and 30 chars long')
    .escape(), // replace <, >, &, ', " and / with HTML entities
  check('sauce.manufacturer')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Manufacturer cannot be empty')
    .isLength({ min: 3, max: 30 })
    .withMessage('Manufacturer must be between 3 and 30 chars long'),
  //.escape(), // replace <, >, &, ', " and / with HTML entities
  check('sauce.description')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 chars long')
    .escape(), // replace <, >, &, ', " and / with HTML entities
  check('sauce.mainPepper')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Main pepper ingredient cannot be empty')
    .isLength({ min: 3, max: 30 })
    .withMessage('Main pepper ingredient must be between 3 and 30 chars long')
    .escape(), // replace <, >, &, ', " and / with HTML entities
  check('sauce.heat')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Sauce heat cannot be empty')
    .isInt({ min: 1, max: 10 })
    .withMessage('Sauce heat must be between 1 and 10'),
];
