const fs = require('fs');

//Declarations of variables:

outputRead = fs.readFileSync('./config/Credenciales.txt', 'utf-8');
credenciales = outputRead;
hostValue = credenciales.split(';')[0];
userValue = credenciales.split(';')[1];
passwordValue = credenciales.split(';')[2];
databaseValue = credenciales.split(';')[3];

const dbCredentials = {
    host: hostValue,
    user: userValue,
    password: passwordValue,
    database: databaseValue,
    port: '3306'
};

module.exports = { dbCredentials };
