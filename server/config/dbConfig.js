const mysql = require('mysql')

//Personal moduls
const { dbCredentials } = require('../dbCredentials');


const database = mysql.createConnection(dbCredentials);

database.connect((err) => {
    if(err) {
        console.log('Error al conectar a la base de datos', err);
    } else {
        console.log('DB is connected');
    }
});

module.exports = { database };
