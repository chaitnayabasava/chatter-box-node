const express = require('express');
const socket = require('socket.io');

const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, function() {
    console.log(`listening on ${port}`);
});

const io = socket(server);

io.on('connection', function(socket) {
    socket.on('message', (data) => {
        socket.broadcast.emit('message', {
            from: data.from,
            mssg: data.msg
        });
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', {from: data.from});
    })
})