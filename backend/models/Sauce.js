const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'A sauce must be created by a known user'],
  },
  name: {
    type: String,
    required: [true, 'A sauce must have a name'],
    minLength: [5, 'Sauce name must be at least 5 character long'],
    trim: true,
  },
  manufacturer: {
    type: String,
    required: [true, 'A sauce must have a manufacturer'],
    minLength: [3, 'Sauce name must be at least 5 character long'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'A sauce must have a description'],
    minLength: [20, 'Description must be at least 20 character long'],
    trim: true,
  },
  mainPepper: {
    type: String,
    required: [true, 'A sauce must have a main pepper ingredient'],
    minLength: [3, 'Sauce name must be at least 5 character long'],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'A sauce must have an image'],
  },
  heat: {
    type: Number,
    required: [true, 'A sauce must have a heat intensity'],
    min: [1, 'Minimal heat intensity is 1'],
    max: [10, 'Maximal heat intensity is 10'],
  },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: [String], required: true },
  usersDisliked: { type: [String], required: true },
});

module.exports = mongoose.model('Sauce', sauceSchema);
