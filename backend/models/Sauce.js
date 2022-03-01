const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'A sauce must be created by a known user'],
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'A sauce must have a name'],
    // minLength: [5, 'Sauce name must be at least 5 characters long'],
    // maxLength: [30, 'Sauce name must be less than 30 characters long'],
    // trim: true,
  },
  manufacturer: {
    type: String,
    required: [true, 'A sauce must have a manufacturer'],
    // minLength: [3, 'Sauce manufacturer must be at least 3 characters long'],
    // maxLength: [20, 'Sauce name must be less than 20 characters long'],
    // trim: true,
  },
  description: {
    type: String,
    required: [true, 'A sauce must have a description'],
    // minLength: [20, 'Description must be at least 20 characters long'],
    // maxLength: [2000, 'Description must be less than 2000 characters long'],
    // trim: true,
  },
  mainPepper: {
    type: String,
    required: [true, 'A sauce must have a main pepper ingredient'],
    // minLength: [3, 'Main pepper ingredient must be at least 3 characters long'],
    // maxLength: [
    //   20,
    //   'Main pepper ingredient must be less than 20 characters long',
    // ],
    // trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'A sauce must have an image'],
    // trim: true,
  },
  heat: {
    type: Number,
    required: [true, 'A sauce must have a heat intensity'],
    // min: [1, 'Minimal heat intensity is 1'],
    // max: [10, 'Maximal heat intensity is 10'],
  },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: [String], default: [] },
  usersDisliked: { type: [String], default: [] },
});

module.exports = mongoose.model('Sauce', sauceSchema);
