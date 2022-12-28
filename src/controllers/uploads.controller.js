const { request, response } = require('express');

const { uploadLocalFile, 
        uploadClouinaryFile, 
        removeLocalFile, 
        removeCloudinaryFile } = require('../helpers/upload-file');

const { Usuario, Category, Product } = require("../models");

const uploadFile = async(req = request, res) =>{
    
    console.log(req.files);
    try {
        const { uploadPath } = await uploadLocalFile(req.files, undefined, undefined);
        
        const url = await uploadClouinaryFile( uploadPath );

        // removeLocalFile( updateFile );

        res.json({
            ok: true,
            data:{
                url
            }
        });
        
    } catch (error) {
        console.log(error);
        res.status(400).json({

        });
    }

};

const updateFile = async(req, res =  response) =>{

    const { id, collection } =  req.params;
    let model;

    try {
        switch ( collection ) {
            case "users":
                model = await Usuario.findById(id);
                if( !model ){
                    return res.status(400).json({
                        ok:false,
                        msg:`User with ${id} not found`
                    });
                }
                break;
            case "products":
                model = await Product.findById(id);
                if( !model ){
                    return res.status(400).json({
                        ok:false,
                        msg:`Product with ${id} not found`
                    });
                }
                break;
            case "categories":
                model = await Category.findById(id);

                if( !model ){
                    return res.status(400).json({
                        ok:false,
                        msg:`Category  with ${id} not found`
                    });
                }
                break;
            default:
                return res.status(400).json({
                    ok: false,
                    msg:"Collection not found, try another"
                });
        }

        if(model.img && model.img !== ''){
            await removeCloudinaryFile( model.img );
            model.img = '';
        }

        const { temporalName, uploadPath } = await uploadLocalFile( req.files, undefined, undefined );
        const url = await uploadClouinaryFile( uploadPath );
        removeLocalFile(temporalName, undefined);
        model.img = url;

        await model.save();

        res.json({
            ok:true,
            data:{
                model
            }
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Report the problem to the admin"
        });
    }
};


const getFile = async(req, res = response) =>{

    const { id, collection } =  req.params;

    let model;

    try {
        
        switch ( collection ) {
            case "users":
                model = await Usuario.findById(id);
                if( !model ){
                    return res.status(400).json({
                        ok: false,
                        msg:`User not found ${id}`
                    });
                }
                break;
            case "products":
                model = await Product.findById(id);
                if( !model ){
                    return res.status(400).json({
                        ok: false,
                        msg:`Product not found ${id}`
                    });
                }
                break;
            case "categories":
                model = await Category.findById(id);
                if( !model ){
                    return res.status(400).json({
                        ok: false,
                        msg:`Category not found ${id}`
                    });
                }
                break;
            default:
                return res.status(400).json({
                    ok: false,
                    msg:"Collection does not exist"
                });
        }


        if(!model.img){
            return res.status(400).json({
                ok:false,
                msg:"Model dont have image to show"
            });
        }

        res.json({
            ok: true,
            data:{
                url: model.img
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Report the problem to the admin"
        });
    }
};

module.exports = {
    uploadFile,
    updateFile,
    getFile
}