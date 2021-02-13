module.exports = (sequelize, DataTypes) => {
    const Chart = sequelize.define('Chart', {
        rank : {
            type : DataTypes.INTEGER,
            allowNull : false,
        },
        title : {
            type : DataTypes.STRING(100),
            allowNull : false,
        },
        artist : {
            type : DataTypes.STRING(40),
            allowNull : false,
        },
        album : {
            type : DataTypes.STRING(100),
            allowNull : false,
        },
        site : {
            type : DataTypes.STRING(10),
            allowNull : false,
        },
    }, {
        charset : 'utf8',
        collate : 'utf8_general_ci'
    });
    Chart.associate = (db) => {};
    return Chart;
}