const {socketConstant} = require("./modules/utils/Constants");
const chatModule = require('./modules/ChatRoomModule')
const messageModule = require('./modules/MessageModule')
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index.html');
});

io.on(socketConstant.SOCKET_CONNECTION, (socket) => {

    socket.on(socketConstant.SOCKET_REGISTER_USER, userName => {
        socket.join(userName)

        let currUser = chatModule.registerUser(userName, socket.id)
        io.emit(socketConstant.SOCKET_USER_ONLINE_MESSAGE, messageModule.createMessageToAllFromSystem(chatModule.listUsersOnline()))
        socket.emit(socketConstant.SOCKET_REGISTER_USER_RESPONSE, messageModule.createMessageFromSystem(userName, currUser))

    })
    socket.on(socketConstant.SOCKET_DISCONNECTED, _ => {
        chatModule.userDisconnected(socket.id)
        let msg = messageModule.createMessageToAllFromSystem(chatModule.listUsersOnline())
        io.emit(socketConstant.SOCKET_USER_ONLINE_MESSAGE, msg)
    })
    socket.on(socketConstant.SOCKET_REQUEST_PLAY, userName => {
        let user = chatModule.checkUser('', socket.id)
        if (user) {
            io.to(userName).emit(socketConstant.SOCKET_REQUEST_PLAY, messageModule.createMessage(user.userName, userName, `Come to play with ${user.userName}!`))
        } else {
            handleErrorMessage({message: 'current user is not connect'}, socket)
        }
    })
    socket.on(socketConstant.SOCKET_REQUEST_PLAY_ANSWER, data => {
        let response = JSON.parse(data)
        let toUser = response.userName;
        let user = chatModule.checkUser('', socket.id)
        if (!user) {
            handleErrorMessage({message: 'current user is not connect'}, socket)
            return
        }
        if (response.isAccept) {
            io.to(toUser).emit(socketConstant.SOCKET_REQUEST_PLAY_ANSWER, messageModule.createMessage(user.userName, toUser, true))
        } else {
            io.to(toUser).emit(socketConstant.SOCKET_REQUEST_PLAY_ANSWER, messageModule.createMessage(user.userName, toUser, false))
        }
    })
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});

function handleErrorMessage(error, socket) {
    socket.emit(socketConstant.SOCKET_ERROR_MESSAGE, messageModule.createMessageToAllFromSystem(error.message))
}