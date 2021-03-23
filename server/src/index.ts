import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import mysql from 'mysql';
const MySQLStore = require('express-mysql-session')(session);

//PERSONAL MODULES:
import dbCredentials from './dbCredentials';

// STATEMENTS
const app = express();

// MIDDfrom
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(
  cors({
    origin: 'http://localhost:3000', // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.use(
  session({
    secret: 'asdf33g4w4hghjkuil8saef345',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(dbCredentials),
  })
);
app.use(cookieParser('asdf33g4w4hghjkuil8saef345'));
app.use(passport.initialize());
app.use(passport.session());
import './lib/passport';

//GLOBAL VARIABLES:
app.use((req: any, res: any, next) => {
  app.locals.user = req.user;
  next();
});

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
