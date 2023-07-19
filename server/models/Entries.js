module.exports = (sequelize, DataTypes) => {

    const Entries = sequelize.define("Entries", {
        song: {
            type: DataTypes.STRING, 
            allowNull: false
        },        
        artist: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        album: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        year: {
            type: DataTypes.INTEGER, 
            allowNull: false
        },
        excerpt: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        link: {
            type: DataTypes.STRING, 
            allowNull: false
        },
    });

    Entries.associate = (models) => {
        Entries.belongsTo(models.Users, {
            onDelete: "cascade"
        });

        Entries.belongsTo(models.Players, {
            onDelete: "cascade"
        });
    };

    return Entries;
} 