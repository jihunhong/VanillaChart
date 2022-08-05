"use strict";
module.exports = (sequelize, DataTypes) => {
    const Chart = sequelize.define('charts', {
        rank: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        site: {
            type: DataTypes.STRING(15),
            allowNull: false
        }
        // musicId
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
    Chart.associate = (db) => {
        db.Chart.belongsTo(db.Music);
    };
    return Chart;
};
//# sourceMappingURL=Chart.js.map