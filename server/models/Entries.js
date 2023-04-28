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
        player: {
            type: DataTypes.STRING, 
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

    return Entries;
} 