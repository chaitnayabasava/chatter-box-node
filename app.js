const socket = require('socket.io');

module.exports = (app) => {
    const port = process.env.PORT || 3000;
    const server = app.listen(port, function() {
        console.log(`listening on ${port}`);
    });

    const io = socket(server);

    io.on('connection', function(socket) {
        console.log(socket.id);
        socket.on('message', (data) => {
            socket.broadcast.emit('message', {...data});
        });

        socket.on('typing', (data) => {
            socket.broadcast.emit('typing', {from: data.from});
        })

        socket.on('disconnect', () => console.log('user disconnected'));
    })
}