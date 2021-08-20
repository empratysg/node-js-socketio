const {userStatus} = require('./utils/Constants')
let users = [];
const chatRooms = []
const ChatRoomModule = {
    checkUser: function (userName, id) {
        return users.find(u =>
            u.userName === userName || u.socketId === id
        )
    },
    registerUser: function (userName, id) {
        let u = this.checkUser(userName, id)
        if (!u) {
            u = {
                socketId: id,
                userName: userName,
                status: userStatus.ONLINE
            }
            users.push(u)
        }
        return u
    },
    listUsersOnline: function () {
        return users
    },
    userDisconnected: function (id) {
        users = users.filter(u => u.socketId !== id)
    }
};

module.exports = ChatRoomModule
