const express = require('express');

const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router
  .route('/')
  .get(auth, sauceCtrl.getAllSauce)
  .post(auth, multer, sauceCtrl.createSauce);

router
  .route('/:id')
  .get(auth, sauceCtrl.getOneSauce)
  .put(auth, multer, sauceCtrl.modifySauce)
  .delete(auth, sauceCtrl.deleteSauce);

router.route('/:id/like').post(auth, sauceCtrl.likeSauce);

module.exports = router;
