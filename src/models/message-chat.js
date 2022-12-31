class Message{

    constructor(uid, name, message){
        this.message = message;
        this.uid     = uid;
        this.name    = name;
    }

}


class MessageChat{

    constructor(){
        this.messages = [];
        this.users = {};
    }

    get LastMessages(){
        return this.messages.splice(0,10);
    }

    get usersOn(){
        return Object.values(this.users);
    }

    sendMessage(uid, name, message){

        this.messages.unshift(new Message(uid, name, message));
    }

    connectUser(user){
        this.users[user.id] = user;
    }

    disconnectUser( uid ){
        delete this.users[ uid ];
    }
}

module.exports = MessageChat;