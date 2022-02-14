const Ajv = require('ajv');
const { validateSchemaDeps } = require('ajv/dist/vocabularies/applicator/dependencies');
const ajv = new Ajv({allErrors: true});
require('ajv-errors')(ajv, {singleError: true});



const userSchema = {
  type: "object",
  properties: {
    email: {type: "string", pattern: "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"},
    password: {type: "string", pattern: "(?=^.{8,}$)(?=.*\\d)(?=.*[!@#$%^&*]+)(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$"}
  },
  required: ["email", "password"],
  errorMessage: {
    properties: {
      email: " Format d'adresse email non valide ",
      password: " Le mot de passe doit contenir au minimum 8 caractères dont 1 minuscule, 1 majuscule, 1 chiffre et 1 caractère spécial "
    }
  }
}

const validate = ajv.compile(userSchema);


module.exports = (req, res, next) => {
  const valid = validate(req.body);
  if (!valid) {

    res.status(400).json({error : validate.errors[0]});
  }
  else {
    next();
  }
};