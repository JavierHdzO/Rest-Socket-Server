const { Router } = require('express');
const { check } = require('express-validator');

const { existsEmailValidator } =  require('../helpers/db-validator');
const { validSlots, validateJwt } = require('../middlewares');

const { login,
        googleSignIn,
        validatorJWT } = require( '../controllers/auth.controllers' );


const router = Router();

router.post('/login',[
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    validSlots
], login);

router.post('/google',[
    check('idToken', "Google's idToken is required").not().isEmpty(),
    validSlots
], googleSignIn);

router.get('/', [
    validateJwt
], validatorJWT)



module.exports = router;