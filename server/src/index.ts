import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql";
import fs from "fs";
import database from "./config/dbConfig";

// STATEMENTS
const app = express();

// MIDDfrom
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//OTRO COMENTARIO

// ROUTES
import getRoutes from "./querys/getRequest";
import postRoutes from "./querys/postRequest";

app.use(getRoutes)
app.use(postRoutes)

// PORT STATEMENT
app.listen(10000, () => {
  console.log("Running on port 10000");
});

//HOLA