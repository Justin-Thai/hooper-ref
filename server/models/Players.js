module.exports = (sequelize, DataTypes) => {

    const Players = sequelize.define("Players", {
        name: {
            type: DataTypes.STRING, 
            allowNull: false
        },        
        playerCode: {
            type: DataTypes.STRING, 
            allowNull: false
        },
    }, {
        timestamps: false
    });

    Players.associate = (models) => {
        Players.hasMany(models.Entries, {
            onDelete: "cascade",
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Players;
} 