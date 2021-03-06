/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerSchema = require('../validators/register');
const secret = require('../secret');
const User = require('../models/User');

module.exports = (req, res, next) => {
  const data = req.body;
  const result = registerSchema.validate(data);
  if (result.error) {
    res.json({ error: 'data not sent right!!!' });
    return;
  }

  bcrypt.hash(data.password, 12)
    .then((hash) => {
      const newUser = User({
        username: data.username,
        password: hash,
        email: data.email,
      });
      return newUser.save();
    })
    .then((result) => {
      const authToken = jwt.sign({
        userId: result._id,
        userName: result.username,
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
      }, secret.jwt_token);
      const sendData = { ...result._doc };
      delete sendData.password;

      sendData.auth_token = authToken;
      res.json(sendData);
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 409;
      if (err.keyPattern.username) err.message = 'username already taken!!!';
      else if (err.keyPattern.email) err.message = 'This email is already used!!!';
      next(err);
    });
};
