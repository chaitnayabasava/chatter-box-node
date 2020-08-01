const User = require("../models/User");

module.exports = (req, res, next) => {
    const query = req.body.query;

    User.find({
        $and: [
            { "_id": {"$ne": req.userId}},
            {"username": {"$regex": query, "$options": "i"}}
        ]
    }).select('username _id').limit(10)
    .then(data => res.json(data))
    .catch(err => {
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    });
}