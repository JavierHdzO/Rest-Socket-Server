

const socketController = ( socket ) => {

    socket.emit('message', 'hola');
}

module.exports = {
    socketController
};