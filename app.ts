import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import passport from 'passport';
import { passportConfig  } from './src/passport'
import { sequelize } from './src/models';
import cors from 'cors';

//  Router 
import chartRoutes from './src/routes/chart-routes';
import userRoutes from './src/routes/user-routes';
import albumRoutes from './src/routes/album-routes';
import videoRoutes from './src/routes/video-routes';
import songRoutes from './src/routes/song-routes';
import artistRoutes from './src/routes/artist-routes';
import oauthRoutes from './src/routes/oauth-routes';

const app = express();
dotenv.config({ path : path.join(__dirname, './.env')});

sequelize.sync({ force : false })
  .then(() => {
    console.log('Connected database ⚡');
  }).catch((err) => {
    console.error(err);
    console.log('Failed to connect database 🔥');
  });

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://www.cherrychart.com' : 'http://localhost:3000',
  credentials: true,
}))

passportConfig();
app.use(passport.initialize());
app.use('/api/cover', express.static(path.join(__dirname, '../covers')));

app.use('/api/user', userRoutes);
app.use('/api/album', albumRoutes);
app.use('/api/chart', chartRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/song', songRoutes);
app.use('/api/artist', artistRoutes);
app.use('/api/oauth', oauthRoutes);

app.listen(8080, () => {
  console.log('LOCAL DEV SETTING app.listen port 8080')
})