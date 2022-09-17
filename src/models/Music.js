module.exports = (sequelize, DataTypes) => {
    const Music = sequelize.define('music', {
        title : {
            type : DataTypes.STRING(150),
            allowNull : false,
        },
        artistName : {
            type : DataTypes.STRING(150),
            allowNull : false,
        },
        albumName : {
            type : DataTypes.STRING(150),
            allowNull : false,
        },
        lead: {
            type: DataTypes.BOOLEAN,
        }
    }, {
        charset : 'utf8',
        collate : 'utf8_general_ci'
    });
    Music.associate = (db) => {
        db.Music.hasMany(db.PlaylistItems);
        db.Music.hasMany(db.Chart);
        db.Music.hasOne(db.Video);
        db.Music.belongsTo(db.Album);
        db.Music.belongsToMany(db.User, { through: 'Like', as: 'liker' });
    };
    return Music;
}