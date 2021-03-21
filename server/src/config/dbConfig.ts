import mysql from "mysql";
//Personal moduls

interface IdbCredentials {
  host: string;
  user: string;
  password: string;
  database: string;
}

import dbCredentials from "../dbCredentials";

const database = mysql.createConnection(dbCredentials);

database.connect((err) => {
  if (err) {
    console.log("Error al conectar a la base de datos", err);
  } else {
    console.log("DB is connected");
  }
});

// module.exports = { database };
export default database;
