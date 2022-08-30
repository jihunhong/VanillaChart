module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
        email : {
            type : DataTypes.STRING(40),
            unique : true,
        },
        nickname : {
            type : DataTypes.STRING(30),
            allowNull : true,
        },
        oauth_id: {
            type: DataTypes.STRING(150),
            allowNull: true,
        },
        accessToken: {
            type: DataTypes.STRING(300),
            allowNull: true,
        },
        refreshToken: {
            type: DataTypes.STRING(150),
            allowNull: true,
        },
        expire: {
            type: DataTypes.STRING(20),
        },
        picture: {
            type: DataTypes.STRING(300),
        },
        password : {
            type : DataTypes.STRING(100),
            allowNull : true,
        },
    }, {
        charset : 'utf8',
        collate : 'utf8_general_ci'
    });
    User.associate = (db) => {
        db.User.hasMany(db.Playlist);
    };
    return User;
}