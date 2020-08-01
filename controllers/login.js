/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginSchema = require('../validators/login');
const secret = require('../secret');
const User = require('../models/User');

module.exports = (req, res, next) => {
  const data = req.body;
  const schemaResult = loginSchema.validate(data);
  if (schemaResult.error) {
    res.json({ error: 'data not sent right!!!' });
    return;
  }

  User.findOne({ username: data.username })
    .then((result) => {
      if (result == null) {
        const err = new Error("Username doesn't exist");
        err.statusCode = 404;
        next(err);
        return;
      }
      bcrypt.compare(data.password, result.password, (err, isMatch) => {
        if (err) {
          if (!err.statusCode) err.statusCode = 500;
          next(err);
        } else if (!isMatch) {
          const err = new Error('Password is incorrect');
          err.statusCode = 404;
          next(err);
        } else {
          const authToken = jwt.sign({
            userId: result._id,
            userName: result.username,
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
          }, secret.jwt_token);
          const sendData = { ...result._doc };
          delete sendData.password;

          sendData.auth_token = authToken;
          res.json(sendData);
        }
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};
