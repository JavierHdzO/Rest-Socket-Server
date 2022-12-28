const { Router } = require('express');
const { check }     = require('express-validator');

const { validateFile, validSlots } = require('../middlewares');
const { allowedCollections } = require('../helpers/db-validator');
const { updateFile, 
        getFile, 
        uploadFile  } = require('../controllers/uploads.controller');


const router = Router();

router.post('/',[
    validateFile,
], uploadFile);

router.get('/:id/:collection', [
    validateFile,
    check('id', 'Id must be MongoID').isMongoId(),
    check('collection').custom( c => allowedCollections( c, ['users', 'products']) ),
    validSlots
],getFile);

// router.get('/:id', getFile);

router.put('/:id/:collection', [
    validateFile,
    check('id', 'Id must be MongoID').isMongoId(),
    check('collection').custom( c => allowedCollections( c, ['users', 'products']) ),
    validSlots
],updateFile);

// router.delete('/:id', deleteFile);

module.exports = router;