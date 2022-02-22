const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Veuillez renseigner une adresse email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Veuillez renseigner un mot de passe'],
  },
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);
