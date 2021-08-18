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
        if (!this.checkUser(userName, id)) {
            users.push({
                socketId: id,
                userName: userName,
                status: userStatus.ONLINE
            })
        } else {
            throw new Error('this user was taken!')
        }
    },
    listUsersOnline: function () {
        return users
    },
    userDisconnected: function (id) {
        users = users.filter(u => u.socketId !== id)
    }
};

module.exports = ChatRoomModule
