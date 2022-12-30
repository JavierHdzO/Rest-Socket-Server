
const User = require('../models/usuario');
const { generateJWT } = require('../helpers/generateJWT');

const { googleVerify } =  require('../helpers/google-verify');



const login = async ( req, res ) =>{

    const { email, password } = req.body;
    
    try {

        // must verify if email exists

        const user = await User.findOne( { email } );

        if ( !user ) return res.status(400).json({ ok: false, msg:'Incorrect username or password - email'})
        // must verify if user still exists

        if( !user.status ) return res.status(400).json({ ok: false, msg:'Incorrect username or password - status' });
        
        // must verify if paassword is correct
        
        const existsPassword = await user.comparePassword(password);

        if( !existsPassword ) return res.status(400).json({ ok: false, msg:'Incorrect username or password - password' });
        
        // Generate JWT

        const token = await generateJWT(user._id);


        res.json({
            ok: true,
            data:{
                user,
                token
            }
        });
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            msg: 'Report to admin this error',
            ok: false
        });

    }


}


const googleSignIn = async( req , res ) => {
    const { idToken } = req.body;
    
    try {
        const { email, img, name } = await googleVerify( idToken ); 

        let user = await User.findOne({ email });

        //if user no exists

        
        if( !user ){
            const data = {
                name,
                email,
                password: 'xxx-XXX-xxx',
                img,
                google: true,
                role:'USER_ROLE'
            }
            
            user = new User( data );
            
            await user.save();
        }
        
        // if status user is false
        
        
        if( !user.status ){
            return res.status(401).json({
                msg: 'Report to admin this issue (inactived user)',
                ok: false
            });
        }

        const token = await generateJWT(user._id);


        res.json({
            ok: true,
            data:{
                user,
                token
            }
        })

    } catch (error) {
        return res.status(400).json({
            msg:'Token is missing or invalid',
            ok: false

        })
    }

}


const validatorJWT = async( req, res) => {

    
    const token = req.header('x-token');
    try {
        const refresh_token = await generateJWT(req.uid);
        
        res.json({
            ok: true,
            data:{
                user: req.authUser,
                refresh_token,
                token
            }
        });

    } catch (error) {
       console.log(error);
       res.status(500).json({
        ok:false,
        msg:'Report the problem to the admin'
       });
    }
}

module.exports = {
    validatorJWT,
    login,
    googleSignIn
}