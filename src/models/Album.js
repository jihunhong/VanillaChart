module.exports = (sequelize, DataTypes) => {
    const Album = sequelize.define('albums', {
        albumName : {
            type : DataTypes.STRING(150),
            allowNull : false,
        },
        artistName : {
            type : DataTypes.STRING(150),
            allowNull : false
        },
        releaseDate : {
            type: DataTypes.STRING(10),
        },
        site: {
            type: DataTypes.STRING(10)
        },
        description: {
            type: DataTypes.TEXT
        }
    }, {
        charset : 'utf8',
        collate : 'utf8_general_ci'
    });
    Album.associate = (db) => {
        db.Album.hasMany(db.Music);
    };
    return Album;
}