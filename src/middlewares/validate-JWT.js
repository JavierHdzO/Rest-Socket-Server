const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/usuario');

const validateJwt = async ( req = request, res, next) => {

    const token = req.header('x-token');
    if( !token ) return res.status(401).json({
        ok: false,
        msg: "Token missing or incorrect"
    });
    
    try {

        const { uid } = jwt.verify(token, process.env.PRIVATEKEY);
        
        const authUser = await User.findById(uid);

        if( !authUser ) return res.status(401).json({ 
            ok: false,
            msg: "Token missing or incorrect"
        });

        /** was user deleted (status:false)?  */

        if (!authUser.status) res.status(401).json({
            ok: false,
            msg: "Token missing or incorrect" 
        });



        req.authUser = authUser;
        req.uid = uid;

        next();

    } catch (error) {
        res.status(401).json({
            msg:"Token missing or incorrect"
        });
    }

    // next();

};

module.exports = {
    validateJwt
};

// 62d9ab788f8848132f954054

//62d9ab818f8848132f954058

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MmQ5YWI3ODhmODg0ODEzMmY5NTQwNTQiLCJpYXQiOjE2NTg1MTc1MjIsImV4cCI6MTY1ODUzMTkyMn0.0AqBiz8gBy4FcV0UUCDhnewZQ05aTrYIeAcM1nNWTr4"
