"use strict";
module.exports = (sequelize, DataTypes) => {
    const Album = sequelize.define('Album', {
        album: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        artist: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        releaseDate: {
            type: DataTypes.STRING(10),
        },
        site: {
            type: DataTypes.STRING(10)
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
    Album.associate = (db) => {
        db.Album.hasMany(db.Music);
    };
    return Album;
};
//# sourceMappingURL=Album.js.map