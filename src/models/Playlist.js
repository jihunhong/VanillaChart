module.exports = (sequelize, DataTypes) => {
    const Playlist = sequelize.define('playlist', {
        pId: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        title : {
            type : DataTypes.STRING(150),
            allowNull : false,
        },
        description: {
            type: DataTypes.STRING(450),
            allowNull: true
        },
        userId : {
            type : DataTypes.INTEGER,
            allowNull : false,
        },
        private: {
            type : DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        charset : 'utf8',
        collate : 'utf8_general_ci'
    });
    Playlist.associate = (db) => {
        db.Playlist.hasMany(db.PlaylistItems);
        db.Playlist.belongsTo(db.User);
    };
    return Playlist;
}