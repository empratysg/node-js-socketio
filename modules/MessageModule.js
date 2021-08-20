const messageModule = {

    createMessageToAllFromSystem: function (msg) {
        return this.createMessageFromSystem('all', msg)
    },
    createMessageFromSystem: function (to, msg) {
        return this.createMessage('System', to, msg)
    },
    createMessage: function (from, to, msg) {
        return JSON.stringify({
                from: from,
                to: to,
                data: msg
            }
        )
    }
}
module.exports = messageModule