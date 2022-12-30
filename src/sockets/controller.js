const { validateJWT } = require('../helpers/validateJWT');

const socketController = async( socket ) => {

    const token = socket.handshake.headers['x-token'];

    const user = await validateJWT(token);
    
    if( !user ) return socket.disconnect();

    console.log(`${ user.name } is connected`);
    socket.emit('message', 'hola');
}

module.exports = {
    socketController
};