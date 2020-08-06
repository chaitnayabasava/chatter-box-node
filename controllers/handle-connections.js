/* eslint-disable no-underscore-dangle */
const Recent = require('../models/RecentChats');

const recentConnect = (data) => {
  Recent.findById(data.from._id)
    .then((u) => {
      if (!u) {
        const temp = Recent({ _id: data.from._id });
        return temp.save();
      }
      return u;
    })
    .then((u) => u.newConnection(data.to._id))
    .catch((err) => console.log(err));
};

const getRecentConnection = (req, res, next) => {
  const data = req.body;
  Recent.findById(data._id)
    .populate('connected', '_id username')
    .then((u) => {
      if (u) {
        res.json(u.connected);
        return;
      }
      res.json([]);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.recentConnect = recentConnect;
module.exports.getRecentConnection = getRecentConnection;
