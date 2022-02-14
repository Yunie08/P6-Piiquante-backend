const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Veuillez renseigner une adresse email"],
    unique: [true, "Cette adresse email est déjà utilisée"],
    validate: {
      validator: function(v) {
        return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(v);
      },
      message: "Veuillez renseigner une adresse email valide name@domaine.ext"
    }, 
  },
  password: {
    type: String,
    required: [true, "Veuillez renseigner un mot de passe"],
    validate: {
      validator: function(v) {
        return /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(v);
      },
      message: "Le mot de passe doit contenir au minimum 8 caractères dont 1 minuscule, 1 majuscule, 1 chiffre et 1 caractère spécial"
    },
  }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
