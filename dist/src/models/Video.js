"use strict";
module.exports = (sequelize, DataTypes) => {
    const Video = sequelize.define('videos', {
        // musicId
        videoId: {
            type: DataTypes.STRING(20),
            allowNull: false,
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
    Video.associate = (db) => {
        db.Video.belongsTo(db.Music);
    };
    return Video;
};
//# sourceMappingURL=Video.js.map