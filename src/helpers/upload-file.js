const path = require('path');
const fs = require('fs');

const { v4:uuidv4 } = require('uuid');
const cloduinary = require('cloudinary').v2;
cloduinary.config( process.env.CLOUDINARY_URL );


const uploadLocalFile = (file, extensionsAllowed = ['jpg', 'png', 'jpeg', ], nameFolder = 'img') => {

    return new Promise((resolve, reject) => {

        const { image } = file;

        const nameCut   = image.name.split('.');
        const extension = nameCut[ nameCut.length -1];

        if(!extensionsAllowed.includes(extension)){
            return reject(`File is not allowed. Try with this extensions ${ extensionsAllowed }`);
        }

        const temporalName = uuidv4() + '.' + extension;

        const uploadPath = path.join(__dirname, '../uploads/', nameFolder, temporalName);

        image.mv(uploadPath, ( error ) => {
            if(error){
                return reject(error);
            }
        });

        resolve({temporalName, uploadPath});


    });
}

const removeLocalFile = async( file, collection ) =>{

    if(!file){
        throw new Error('File does not exist');
    }

    const pathFile = path.join(__dirname, '../uploads', collection='img', file);

    if(!fs.existsSync(pathFile)) throw new Error('File does not exist');

    fs.unlinkSync(pathFile);

}

const uploadClouinaryFile = async( filePath )=>{

    if( !filePath ) 
        throw new Error('File does not exist');

    try{
       const { secure_url } =  await cloduinary.uploader.upload(filePath);
       return secure_url;
    }catch(error){
        console.log(error);
        throw new Error(error);
    }

}

const removeCloudinaryFile = async( secure_url = undefined )=>{

    if(!secure_url){
        throw new Error('File url is required');
    }
    
    if(!secure_url.startsWith('https://res.cloudinary.com/')){
        throw new Error('secure_url is not allowed');
    }

    const pathSplit = secure_url.split('/');
    
    const file = pathSplit[pathSplit.length - 1];

    const [ public_id ] = file.split('.');

    await cloduinary.uploader.destroy(public_id);
}

module.exports = {
    uploadLocalFile,
    removeLocalFile,    
    uploadClouinaryFile,
    removeCloudinaryFile
}