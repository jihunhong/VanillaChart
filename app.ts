import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import passport from 'passport';
import { passportConfig  } from './src/passport'
import session from 'express-session';
import cookieParser from 'cookie-parser';

//  Router 
import chartRoutes from './src/routes/chart-routes';
import userRoutes from './src/routes/user-routes';

const app = express();
dotenv.config();
passportConfig();

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session({
  saveUninitialized : false,
  resave : false,
  secret : <string> process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userRoutes);
app.use('/chart', chartRoutes);

app.listen(8080, () => {
  console.log('LOCAL DEV SETTING app.listen port 8080')
})