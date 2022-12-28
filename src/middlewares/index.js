
const validSlots        = require('../middlewares/valid-slots');
const validateJwt       = require('../middlewares/validate-JWT');
const validateRoles     = require('../middlewares/validate-role');
const validateCategory  = require('../middlewares/validator-category');
const validateFile      = require('../middlewares/validator-file');


module.exports = {
    ...validSlots,
    ...validateJwt,
    ...validateRoles,
    ...validateCategory,
    validateFile
}