"use strict";
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.Chart = require('./Chart')(sequelize, Sequelize);
db.Music = require('./Music')(sequelize, Sequelize);
db.User = require('./User')(sequelize, Sequelize);
db.Video = require('./Video')(sequelize, Sequelize);
db.Album = require('./Album')(sequelize, Sequelize);
db.Playlist = require('./Playlist')(sequelize, Sequelize);
db.PlaylistItems = require('./PlaylistItems')(sequelize, Sequelize);
db.Artist = require('./Artist')(sequelize, Sequelize);
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
//# sourceMappingURL=index.js.map