const { validateJWT } = require('../helpers/validateJWT');
const { MessageChat } = require('../models');

const messageChat = new MessageChat();

const socketController = async( socket, io ) => {

    const token = socket.handshake.headers['x-token'];

    const user = await validateJWT(token);
    
    if( !user ) return socket.disconnect();

    // User connect to socket
    console.log(`${ user.name } is connected`);
    messageChat.connectUser( user );

    /** Emits */
    io.emit('users-on', messageChat.usersOn);
    io.emit('recieve-message', messageChat.LastMessages );

    /** Listen */
    socket.on('disconnect', ( )=>{
        messageChat.disconnectUser( user._id );
        io.emit('users-on', messageChat.usersOn);
    });

    socket.on('send-message', ( { message, uid } ) => {

        messageChat.sendMessage( user._id, user.name, message );
        io.emit('recieve-message', messageChat.LastMessages );
    });

}

module.exports = {
    socketController
};