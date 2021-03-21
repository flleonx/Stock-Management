import fs from "fs";

let outputRead: string;
let credenciales: string;
let hostValue: string;
let userValue: string;
let passwordValue: string;
let databaseValue: string;

//Declarations of variables:
import credentials from "./config/Credenciales";
// outputRead = fs.readFileSync('./config/Credenciales.txt', 'utf-8');
credenciales = credentials;
hostValue = credenciales.split(";")[0];
userValue = credenciales.split(";")[1];
passwordValue = credenciales.split(";")[2];
databaseValue = credenciales.split(";")[3];

const dbCredentials = {
  host: hostValue,
  user: userValue,
  password: passwordValue,
  database: databaseValue,
};

export default dbCredentials;
