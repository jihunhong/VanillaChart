module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email : {
            type : DataTypes.STRING(40),
            allowNull : false,
            unique : true,
        },
        nickname : {
            type : DataTypes.STRING(30),
            allowNull : false,
        },
        password : {
            type : DataTypes.STRING(100),
            allowNull : false,
        },
    }, {
        charset : 'utf-8',
        collate : 'utf-8_general_ci'
    });
    User.associate = (db) => {};
    return User;
}