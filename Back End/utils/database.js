const mysql = require('mysql');

const connection = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mdrrmo_app',

});

connection.connect((err) => {

    if(err){

        console.log(`Error Connecting on the database MYSQL: ${err}`);
        return;

    }else{

        console.log(`Successfully Connected to ${connection.config.database}`);

    }

});

module.exports = connection;