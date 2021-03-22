import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql';
import database from './config/dbConfig';

// STATEMENTS
const app = express();

// MIDDfrom
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// ROUTES
import getRoutes from './querys/getRequest';
import postRoutes from './querys/postRequest';
import authRoutes from './querys/authRequest';

app.use(getRoutes);
app.use(postRoutes);
app.use(authRoutes);

// PORT STATEMENT
app.listen(10000, () => {
  console.log('Running on port 10000');
});
