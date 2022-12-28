const { Router } = require('express');

const { updateFile,
        getFiles, 
        getFile, 
        uploadFile, 
        deleteFile  } = require('../controllers/uploads.controller');

const router = Router();

router.post('/', uploadFile);

router.get('/:id/:collection', getFile);

// router.get('/:id', getFile);

router.put('/:id/:collection', updateFile);

// router.delete('/:id', deleteFile);

module.exports = router;