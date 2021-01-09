import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
import passport from 'passport';
import { passportConfig  } from './src/passport'
import session from 'express-session';
import cookieParser from 'cookie-parser';

//  Router 
import userRoutes from './src/routes/user-routes';

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

app.listen(8080, () => {
  console.log('LOCAL DEV SETTING app.listen port 8080')
})