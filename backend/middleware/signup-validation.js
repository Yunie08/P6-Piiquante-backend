const PasswordValidator = require('password-validator');
const emailValidator = require('email-validator');

const schemaPassword = new PasswordValidator();
schemaPassword
  .is()
  .min(8)
  .is()
  .max(25)
  .has()
  .uppercase(1)
  .has()
  .lowercase(1)
  .has()
  .digits(1)
  .has()
  .symbols(1)
  .has()
  .not()
  .spaces();

module.exports = (req, res, next) => {
  const emailIsValid = emailValidator.validate(req.body.email);
  const passwordIsValid = schemaPassword.validate(req.body.password);
  let message = '';
  if (!emailIsValid) {
    message +=
      'Email address invalid. Must use the following pattern: abc@exemple.com.\n';
  }
  if (!passwordIsValid) {
    message +=
      'Password must be between 8 and 25 characters long, and contain at least 1 uppercase, 1 lowercase, 1 digit, 1 symbol and no blank space.';
  }
  if (!emailIsValid || !passwordIsValid) {
    const error = new Error(message);
    return res.status(400).json({ message: error.message });
  }
  next();
};
