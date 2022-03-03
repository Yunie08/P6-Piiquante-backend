const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// Signup new user
exports.signup = (req, res, next) => {
  // Password hash for security
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: 'User signed in !' }))
        .catch((error) =>
          res.status(400).json({
            message: 'User already registered',
            error: error,
          })
        );
    })
    .catch((error) => res.status(500).json({ error }));
};

// Login user and send authetification token
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: 'Unknown user' });
      }
      // Compare input password with hashed password stored in database
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ message: 'Incorrect password' });
          }
          res.status(200).json({
            userId: user._id,
            // Create authentification token
            token: jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
              expiresIn: process.env.TOKEN_EXPIRES_IN,
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
