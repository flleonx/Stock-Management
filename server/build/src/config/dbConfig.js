"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const dbCredentials_1 = __importDefault(require("../dbCredentials"));
const database = mysql_1.default.createConnection(dbCredentials_1.default);
database.connect((err) => {
    if (err) {
        console.log("Error al conectar a la base de datos", err);
    }
    else {
        console.log("DB is connected");
    }
});
exports.default = database;
