
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const mysql = require('mysql');
const fs = require('fs')
const {database} = require('./config/dbConfig.js')

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES

app.use(require('./querys/getRequest'));
app.use(require('./querys/postRequest'));


// PORT STATEMENT
app.listen(10000, () => {
  console.log('Running on port 10000');
});
