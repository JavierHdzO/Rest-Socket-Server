
const validateFile = ( req, res, next ) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.image) {
        return res.status(400).json({
          ok:false,
          msg:'No files were uploaded.'
        });
      }

      next();
}

module.exports = validateFile;