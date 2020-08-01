const socket = require('socket.io');

module.exports = (app) => {
  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    console.log(`listening on ${port}`);
  });

  const io = socket(server);

  io.on('connection', (soc) => {
    console.log(soc.id);
    soc.on('message', (data) => {
      soc.broadcast.emit('message', { ...data });
    });

    soc.on('typing', (data) => {
      soc.broadcast.emit('typing', { from: data.from });
    });

    soc.on('disconnect', () => console.log('user disconnected'));
  });
};
