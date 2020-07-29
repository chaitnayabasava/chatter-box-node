const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerSchema = require("../validators/register");
const secret = require('../secret');
const User = require("../models/User");

const signup = (req, res, next) => {
    const data = req.body;
    const result = registerSchema.validate(data);
    if(result.error) {
        res.json({error: 'data not sent right!!!'});
        return;
    }

    bcrypt.hash(data.password, 12)
    .then(hash => {
        const newUser = User({
            username: data.username,
            password: hash,
            email: data.email
        })
        return newUser.save();
    })
    .then(result => {
        const auth_token = jwt.sign({username: result.username}, secret.jwt_token);
        const data = {...result._doc};
        delete data.password;

        data.auth_token = auth_token;
        res.json(data);
    })
    .catch(err => {
        if(!err.statusCode) err.statusCode = 409;
        if(err.keyPattern.username) err.message = "username already taken!!!";
        else if(err.keyPattern.email) err.message = "This email is already used!!!";
        next(err);
    });
}

module.exports = signup;