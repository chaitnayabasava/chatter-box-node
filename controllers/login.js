const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginSchema = require("../validators/login");
const secret = require('../secret');
const User = require("../models/User");

const signin = (req, res, next) => {
    const data = req.body;
    const result = loginSchema.validate(data);
    if(result.error) {
        res.json({error: 'data not sent right!!!'});
        return;
    }

    
    User.findOne({username: data.username})
    .then(result => {
        if(result == null) {
            const err = new Error("Username doesn't exist");
            err.statusCode = 404;
            next(err);
            return;
        }
        bcrypt.compare(data.password, result.password, function(err, isMatch) {
            if (err) {
                if(!err.statusCode) err.statusCode = 500;
                next(err);
            } else if (!isMatch) {
                const err = new Error("Password is incorrect");
                err.statusCode = 404;
                next(err);
            } else {
                const auth_token = jwt.sign({username: result.username}, secret.jwt_token);
                const data = {...result._doc};
                delete data.password;

                data.auth_token = auth_token;
                res.json(data);
            }
        })
    })
    .catch(err => {
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    })
}

module.exports = signin;