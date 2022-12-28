
const {Role, User, Category, Product} = require('../models');

const roleValidator = async(role = '') => {
    const roleExists = await Role.findOne( { role } );

    if ( !roleExists ) {
        throw new Error('Role is not valid');
    }

    
};

const existsEmailValidator = async ( email = '' ) => {
    const existsEmail = await User.findOne( { email } );

    if ( existsEmail ) {
        throw new Error('Email has already been registered');
    }

};


const existsUserByID = async(id) => {
    const user = await User.findById(id);

    if( !user ) throw new Error('User no exists');
};


const existsCategoryByID = async(id) => {
    const category = await Category.findById(id);

    if( !category ) throw new Error('Category no exists');
};


const existsCategoryByName = async( name  = '') => {

    name  = name.toUpperCase();

    const category = await Category.findOne({name});

    if( category ) throw new Error(`${name} category is alredy registered`);
        
}


const existsProductByID = async( id ) => {

    const product = await Product.findById(id);

    if( !product ) throw new Error(`Proudct with ${id} is not registered`);
        
}


const allowedCollections = ( collection = '', collections = []) => {

    const include = collections.includes(collection);
    if(!include){
        throw new Error(`Try with allowed collections : {${collections}}`);
    }

    return true;
}







module.exports = {
    allowedCollections,
    roleValidator,
    existsEmailValidator,
    existsUserByID,
    existsCategoryByID,
    existsCategoryByName,
    existsProductByID
};