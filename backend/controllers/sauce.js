const fs = require('fs');
const Sauce = require('../models/Sauce');

// Create sauce in database and save picture statically
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  // Check that user doesn't create a sauce with an other user id
  if (sauceObject.userId !== req.auth.userId) {
    const error = new Error('Unauthorized request');
    return res.status(403).json({ error: error.message });
  }
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce created' }))
    .catch((error) => res.status(400).json(error));
};

// Get all sauces from database
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json(error));
};

// Get sauce corresponding to specified id
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json(error));
};

// Delete existing sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findById(req.params.id)
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({ error: new Error('Sauce not found') });
      }
      // Authorization check : the user is the one who created the sauce
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({ error: 'Unauthorized request' });
      }
      // Delete sauce in database and picture in static folder
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce deleted' }))
          .catch((error) => res.status(404).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Modify existing sauce with or without new picture
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body, imageUrl: undefined }; // to avoid model validation error
  // Authorization check: the user is the one who created the sauce
  if (sauceObject.userId !== req.auth.userId) {
    return res.status(403).json({ error: 'Unauthorized request' });
  }
  // Save modifications
  Sauce.findByIdAndUpdate(
    req.params.id,
    {
      ...sauceObject,
      _id: req.params.id,
      // like/dislike data cannot be updated via this route
      likes: undefined,
      dislikes: undefined,
      usersLiked: undefined,
      usersDisliked: undefined,
    },
    { runValidators: true } // activate model validators
  )
    .then((sauce) =>
      sauce
        ? res.status(200).json({ message: 'Sauce modified' })
        : res.status(404).json({ error: 'Sauce not found' })
    )
    .catch((error) => res.status(400).json({ error }));
};

// Add or cancel like and dislike and handle unauthorized double like or dislike
exports.likeSauce = (req, res, next) => {
  const { userId, like } = req.body;

  Sauce.findById(req.params.id)
    .then((sauce) => {
      const usersLikedIndex = sauce.usersLiked.indexOf(userId);
      const usersDislikedIndex = sauce.usersDisliked.indexOf(userId);
      switch (like) {
        // Dislike (like = -1)
        case -1:
          if (usersLikedIndex !== -1) {
            return res.status(400).json({
              error: 'Please cancel your "like" before adding a "dislike"',
            });
          }
          if (usersDislikedIndex === -1) {
            sauce.usersDisliked.push(userId);
            sauce.dislikes += 1;
          } else {
            return res
              .status(400)
              .json({ error: 'Only one "dislike" authorized' });
          }
          break;

        // Cancel like or dislike (like = 0)
        case 0:
          if (usersDislikedIndex !== -1) {
            sauce.usersDisliked.splice(usersDislikedIndex, 1);
            sauce.dislikes -= 1;
          }
          if (usersLikedIndex !== -1) {
            sauce.usersLiked.splice(usersLikedIndex, 1);
            sauce.likes -= 1;
          }
          break;

        // Like (like = 1)
        case 1:
          if (usersDislikedIndex !== -1) {
            return res.status(400).json({
              error: 'Please cancel your "dislike" before adding a "like"',
            });
          }
          if (usersLikedIndex === -1) {
            sauce.usersLiked.push(userId);
            sauce.likes += 1;
          } else {
            return res
              .status(400)
              .json({ error: 'Only one "like" authorized' });
          }
          break;

        // Incorrect value
        default:
          return res.status(400).json({ error: 'Bad request' });
      }
      sauce
        .save()
        .then(() =>
          res.status(200).json({
            message:
              'Thank you for your review! It has been successfully saved.',
          })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
