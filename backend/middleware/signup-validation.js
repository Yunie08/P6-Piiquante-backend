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
  .symbols(1)
  .has()
  .digits(1);

module.exports = (req, res, next) => {
  const emailIsValid = emailValidator.validate(req.body.email);
  const passwordIsValid = schemaPassword.validate(req.body.password);
  let message = '';
  if (!emailIsValid) {
    message += "L'adresse email doit suivre le format abc@exemple.com.\n";
  }
  if (!passwordIsValid) {
    message +=
      'Le mot de passe doit contenir entre 8 et 25 caractères dont au moins 1 minuscule, 1 majuscule, 1 chiffre et 1 caractère spécial';
  }
  if (!emailIsValid || !passwordIsValid) {
    const error = new Error(message);
    return res.status(400).json({ message: error.message });
  }
  next();
};
