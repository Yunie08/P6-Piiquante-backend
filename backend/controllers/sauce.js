const Sauce = require("../models/Sauce");
const fs = require("fs");

// Create sauce in database and save picture statically
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  // Check that user doesn't create sauce with an other user id
  if (sauceObject.userId != req.auth.userId) {
    return res.status(403).json({ error: "Requête non autorisée!" });
  }
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce créée!" }))
    .catch((error) => res.status(400).json({ error }));
};

// Return all sauces in database
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Return sauce corresponding to a specific id
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Delete existing sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({ error: new Error("Objet non trouvé!") });
      }
      // Check whether the user is the one who created the sauce
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({ error: "Requête non autorisée!" });
      }
      // Delete sauce in database and picture in static folder
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé" }))
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
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  // Check whether the user is the one who created the sauce
  if (sauceObject.userId !== req.auth.userId) {
    return res.status(403).json({ error: "Requête non autorisée!" });
  }
  // Save modifications
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Add or cancel like and dislike and handle unauthorized double like or dislike
exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId;
  const like = req.body.like;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const usersLikedIndex = sauce.usersLiked.indexOf(userId);
      const usersDislikedIndex = sauce.usersDisliked.indexOf(userId);
      switch (like) {
        // Dislike
        case -1:
          if (usersLikedIndex != -1) {
            return res.status(400).json({
              error: "Veuillez annuler votre like avant d'ajouter un dislike",
            });
          }
          if (usersDislikedIndex == -1) {
            sauce.usersDisliked.push(userId);
            sauce.dislikes += 1;
          } else {
            return res.status(400).json({ error: "Un seul dislike autorisé" });
          }
          break;

        // Cancel like or dislike
        case 0:
          if (usersDislikedIndex != -1) {
            sauce.usersDisliked.splice(usersDislikedIndex, 1);
            sauce.dislikes -= 1;
          }
          if (usersLikedIndex != -1) {
            sauce.usersLiked.splice(usersLikedIndex, 1);
            sauce.likes -= 1;
          }
          break;

        // Like
        case 1:
          if (usersDislikedIndex != -1) {
            return res.status(400).json({
              error: "Veuillez annuler votre dislike avant d'ajouter un like",
            });
          }
          if (usersLikedIndex == -1) {
            sauce.usersLiked.push(userId);
            sauce.likes += 1;
          } else {
            res.status(400).json({ error: "Un seul like autorisé" });
          }
          break;

        // Incorrect value
        default:
          res.status(400).json({ error: "Bad request" });
      }
      sauce
        .save()
        .then(() => res.status(200).json({ message: "Avis pris en compte !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
