/* eslint-disable no-underscore-dangle */
const Recent = require('../models/RecentChats');

const createConnection = (id1, id2) => {
  Recent.findById(id1)
    .then((u) => {
      if (!u) {
        const temp = Recent({ _id: id1 });
        return temp.save();
      }
      return u;
    })
    .then((u) => u.newConnection(id2))
    .catch((err) => console.log(err));
};

const recentConnect = (data) => {
  createConnection(data.from._id, data.to._id);
  createConnection(data.to._id, data.from._id);
};

const getRecentConnection = (req, res, next) => {
  const data = req.body;
  Recent.findById(data._id)
    .populate('connected', '_id username')
    .then((u) => {
      let temp = [];
      if (u) {
        temp = u.connected;
      }
      res.json({ data: temp });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.recentConnect = recentConnect;
module.exports.getRecentConnection = getRecentConnection;
