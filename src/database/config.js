const { connect } = require('mongoose');


const dbConnection = async () => {

    try {

        await connect(process.env.MONGODB_CNN);
        console.log('Database is connected');
        
    } catch (error) {
        throw new Error('Error to start Database conneection');
    }


}

module.exports = dbConnection;