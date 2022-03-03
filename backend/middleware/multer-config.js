const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    // replaces blank spaces by underscores
    const name = file.originalname.split(' ').join('_').split('.')[0];
    // apply file extension corresponding to image MIME type
    const extension = MIME_TYPES[file.mimetype];
    callback(null, `${name}${Date.now()}.${extension}`);
  },
});

// Maximal authorized file size
const maxSize = 2097152; // 2Mo

const upload = multer({
  storage,
  limits: { fileSize: maxSize },
}).single('image');

module.exports = (req, res, next) => {
  upload(req, res, (err) => (err ? res.status(400).json(err) : next()));
};
