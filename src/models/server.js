const path = require('path');
const { createServer } = require('http');

const express   = require('express');
const { Server }= require('socket.io');
const cors      = require('cors');
const fileupload = require('express-fileupload');

const dbConnection = require('./../database/config');
const { socketController } = require('../sockets');


class Serve {

    constructor(){
        this.app = express();
        this.httpServer = createServer(this.app);
        this.io = new Server(this.httpServer, {});
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

        //sockets
        this.sockets();
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
        this.app.use( fileupload({
            useTempFiles: true,
            tempFileDir: path.join(__dirname, "../uploads"),
            createParentPath: true
        }));
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth.routes') );
        this.app.use(this.paths.users, require('../routes/user.routes') );
        this.app.use(this.paths.categories, require('../routes/categories.routes'));
        this.app.use(this.paths.products, require('../routes/products.routes'));
        this.app.use(this.paths.search, require('../routes/search.routes'));
        this.app.use(this.paths.uploads, require('../routes/uploads.routes'));
    }

    sockets(){
        this.io.on('connection', socketController);
    }

    listen(){
        this.httpServer.listen( this.port, () => {
            console.log(`Server on port ${ this.port }`);
        });
    }
    
}

module.exports = Serve;