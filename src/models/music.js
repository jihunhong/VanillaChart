module.exports = (sequelize, DataTypes) => {
    const Music = sequelize.define('Music', {
        title : {
            type : DataTypes.STRING(150),
            allowNull : false,
        },
        artist : {
            type : DataTypes.STRING(150),
            allowNull : false,
        },
        album : {
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
        db.Music.hasMany(db.Chart);
        db.Music.hasOne(db.Video);
        db.Music.belongsTo(db.Album);
    };
    return Music;
}