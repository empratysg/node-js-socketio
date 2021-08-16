const constants = require('./src/utils/Constants')
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const users = []

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index.html');
});

io.on(constants.SOCKET_CHAT_MESSAGE, (socket) => {
    socket.on(constants.SOCKET_CHAT_MESSAGE, msg => {
        if (!users.includes(msg)) {
            users.push(msg)
            io.emit(constants.SOCKET_CHAT_MESSAGE, msg);
        } else {
            io.emit(constants.SOCKET_ERROR_MESSAGE, 'this user already exist!')
        }
        console.log(users)
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});