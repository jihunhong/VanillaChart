module.exports = (sequelize, DataTypes) => {
    const Artist = sequelize.define('artist', {
        artistName : {
            type : DataTypes.STRING(100),
            allowNull : false,
        },
        description : {
            type : DataTypes.TEXT,
        },
        site: {
            type: DataTypes.STRING(10)
        }
    }, {
        charset : 'utf8',
        collate : 'utf8_general_ci'
    });
    Artist.associate = (db) => {
        db.Artist.hasMany(db.Music);
        db.Artist.hasMany(db.Album);
    };
    return Artist;
}