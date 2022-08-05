"use strict";
module.exports = (sequelize, DataTypes) => {
    const PlaylistItems = sequelize.define('playlistItems', {
        musicId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        // playlistPId
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
    PlaylistItems.associate = (db) => {
        db.PlaylistItems.belongsTo(db.Music);
        db.PlaylistItems.belongsTo(db.Playlist);
    };
    return PlaylistItems;
};
//# sourceMappingURL=PlaylistItems.js.map