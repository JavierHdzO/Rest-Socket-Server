
const jwt = require('jsonwebtoken');

const { Usuario } = require('../models');

const validateJWT = async( token ) => {

    if(token < 10 || !token){
        console.log('entre');
        return null;
    }
    
    try {
        const { uid } = jwt.verify(token, process.env.PRIVATEKEY);

        const user = await Usuario.findById(uid);

        if(!user){
            return null;
        }

        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
}


module.exports = {
    validateJWT
}