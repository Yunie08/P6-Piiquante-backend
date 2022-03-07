const CryptoJS = require('crypto-js');

module.exports = (req, res, next) => {
  const { email } = req.body;

  const key = CryptoJS.enc.Hex.parse(process.env.ENCRYPT_KEY);

  // Encrypt
  req.body.email = CryptoJS.AES.encrypt(email, key, {
    mode: CryptoJS.mode.ECB,
  }).toString();

  next();
};
