/* eslint-disable no-underscore-dangle */
const socket = require('socket.io');
const { recentConnect } = require('./controllers/handle-connections');

module.exports = (app) => {
  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    console.log(`listening on ${port}`);
  });

  const io = socket(server);
  const connections = {};

  io.on('connection', (soc) => {
    soc.on('established', (id) => { connections[id] = soc.id; });

    soc.on('new-connect', recentConnect);

    soc.on('closed', (id) => { delete connections[id]; });

    soc.on('message', (data) => {
      if (!data.to) return;
      soc.to(connections[data.to._id]).emit('message', { ...data });
    });

    soc.on('typing', (data) => {
      if (!data.to) return;
      if (data.tag) recentConnect(data);
      soc.to(connections[data.to._id]).emit('typing', { from: data.from });
    });
  });
};
