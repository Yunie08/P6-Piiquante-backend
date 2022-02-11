const Sauce = require('../models/Sauce');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce créée!'}))
    .catch(error => res.status(400).json({error}));
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id : req.params.id})
    .then(sauce => {
      if (!sauce) {
        return res.status(404).json({error: new Error('Objet non trouvé!')});
      }
      if (sauce.userId !== req.auth.userId) {
        return res.status(401).json({error: new Error('Requête non autorisée!')});
      }
      // Suppression autorisée
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () =>{ 
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet supprimé" }))
        .catch((error) => res.status(404).json({ error }));
      });
    })
    .catch(error => res.status(500).json({error}));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {...req.body};
   // Combler faille de sécurité AUTH ???
  if (sauceObject.userId !== req.auth.userId) {
    return res.status(401).json({error: new Error('Requête non autorisée!')});
  }
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};



exports.likeSauce = (req, res, next) => {

  const userId = req.body.userId;
  const like = req.body.like;

  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const usersLikedIndex = sauce.usersLiked.indexOf(userId);
      const usersDislikedIndex = sauce.usersDisliked.indexOf(userId);
      switch(like) {
        case -1:
          if (usersLikedIndex != -1) {
            sauce.usersLiked.splice(usersLikedIndex);
            sauce.likes -= 1;
          }
          if (usersDislikedIndex == -1) {
            sauce.usersDisliked.push(userId);
            sauce.dislikes += 1;
          } else {
            throw new Error('Un seul dislike possible');
          }
          break;

        case 0:
          if (usersDislikedIndex != -1) {
            sauce.usersDisliked.splice(usersDislikedIndex);
            sauce.dislikes -= 1;
          }
          if (usersLikedIndex != -1) {
            sauce.usersLiked.splice(usersLikedIndex);
            sauce.likes -= 1;
          }
          break;

        case 1:
          if (usersDislikedIndex != -1) {
            sauce.usersDisliked.splice(usersDislikedIndex);
            sauce.dislikes -= 1;
          }
          if (usersLikedIndex == -1) {
            sauce.usersLiked.push(userId);
            sauce.likes += 1;
          } else {
            throw new Error('Un seul like possible');
          }
          break;
      }
      sauce.save()
      .then(() => res.status(200).json({ message: "Like pris en compte !" }))
      .catch((error) => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({error}));
}