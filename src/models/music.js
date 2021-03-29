module.exports = (sequelize, DataTypes) => {
    const Music = sequelize.define('Music', {
        title : {
            type : DataTypes.STRING(100),
            allowNull : false,
        },
        artist : {
            type : DataTypes.STRING(40),
            allowNull : false,
            unique : true,
        },
        videoId : {
            type : DataTypes.STRING(30),
            allowNull : false,
            unique : true,
        },
        album : {
            type : DataTypes.STRING(100),
            allowNull : false,
        },
    }, {
        charset : 'utf8',
        collate : 'utf8_general_ci'
    });
    Music.associate = (db) => {};
    return Music;
}