const jwt = require('jsonwebtoken');
const { jwt_token } = require('../secret');

checkAuth = (req, res, next) => {
    var decodeToken = "";
    try{
        decodeToken = jwt.verify(req.headers.authorization, jwt_token);
    } catch(err) {
        err.statusCode = 401;
        throw err;
    }

    // if(Date.now() > decodeToken.exp*1000) {
    //     const err = new Error("Token has expired");
    //     err.statusCode = 403;
    //     throw err;
    // }

    if(decodeToken === "") {
        const err = new Error("You are not authenticated");
        err.statusCode = 401;
        throw err;
    }

    req.userId = decodeToken.userId;
    next();
};

module.exports.checkAuth = checkAuth