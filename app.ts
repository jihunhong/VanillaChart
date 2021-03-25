import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import passport from 'passport';
import { passportConfig  } from './src/passport'
import morgan from 'morgan';

//  Router 
import chartRoutes from './src/routes/chart-routes';
import userRoutes from './src/routes/user-routes';
import { jwtAuth } from './src/middlewares';

const app = express();
dotenv.config({ path : path.join(__dirname, './.env')});

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(morgan('dev'));

passportConfig();
app.use(passport.initialize());
app.use('/api/cover', express.static(path.join(__dirname, '../covers')));

app.use('/api/user', userRoutes);
app.use('/api/chart', jwtAuth);
app.use('/api/chart', chartRoutes);

app.listen(8080, () => {
  console.log('LOCAL DEV SETTING app.listen port 8080')
})