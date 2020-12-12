module.exports = (sequelize, DataTypes) => {
    const Chart = sequelize.define('Chart', {
        name : {
            type : DataTypes.STRING(20),
            allowNull : false,
        },
        category : {
            type : DataTypes.STRING(10),
            allowNull : false,
        },
        description : {
            type : DataTypes.TEXT,
            allowNull : false,
        },
        music_id : {
            type : DataTypes.STRING(20),
            allowNull : false,
        },
        created_at : {
            type : DataTypes.DATE,
            allowNull : DataTypes.NOW,
        },
    }, {
        charset : 'utf-8',
        collate : 'utf-8_general_ci'
    });
    Chart.associate = (db) => {};
    return Chart;
}