const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const User = require("../models/User");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé!" }))
        .catch((error) =>
          res.status(400).json({
            message: "Utilisateur déjà enregistré!",
            error: error,
          })
        );
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    // Ici, même si l'utilisateur n'est pas trouvé, mongoose renvoit quand même une promise résolue
    .then((user) => {
      if (!user) {
        const error = new Error("Utilisateur inconnu!");
        return res.status(401).json({ message: error.message });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect!" });
          }
          res.status(200).json({
            userId: user._id,
            // .sign ({payload = données à encoder},{clé d'encodage},{configuration})
            token: jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
              expiresIn: process.env.TOKEN_EXPIRES_IN,
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
