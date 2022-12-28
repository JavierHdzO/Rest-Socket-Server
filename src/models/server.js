const path = require('path');

const express  = require('express');
const cors = require('cors');
const fileupload = require('express-fileupload');

const dbConnection = require('./../database/config');


class Server {

    constructor(){
        this.app = express(); 
        this.port = process.env.PORT;

        //Paths
        this.paths = {
            auth:       '/api/auth',
            users:      '/api/users',
            categories: '/api/Categories',
            products:   '/api/products',
            search:     '/api/search',
            uploads:     '/api/uploads'
        }

        


        // DB connectio
        this.connectDB();

        //Middleware
        this.middleware();

        //Routes
        this.routes();

    }

    async connectDB () {
        await dbConnection();
    }

    middleware (){
        //CORS
        this.app.use( cors() );

        // Parsing and reading of body
        this.app.use( express.json() )
        this.app.use( express.urlencoded( {extended: false} ) );
        
        
        //Public File
        this.app.use( express.static( path.join('src','public' )));

        // File upload
        this.app.use( fileupload());
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth.routes') );
        this.app.use(this.paths.users, require('../routes/user.routes') );
        this.app.use(this.paths.categories, require('../routes/categories.routes'));
        this.app.use(this.paths.products, require('../routes/products.routes'));
        this.app.use(this.paths.search, require('../routes/search.routes'));
        this.app.use(this.paths.uploads, require('../routes/uploads.routes'));
    }


    listen(){
        this.app.listen( this.port, () => {
            console.log(`Server on port ${ this.port }`);
        });
    }
    
}

module.exports = Server;