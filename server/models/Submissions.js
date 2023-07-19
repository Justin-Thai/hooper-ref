module.exports = (sequelize, DataTypes) => {

    const Submissions = sequelize.define("Submissions", {
        song: {
            type: DataTypes.STRING, 
            allowNull: false
        },        
        artist: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        player: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        link: {
            type: DataTypes.STRING
        },
    });

    Submissions.associate = (models) => {
        Submissions.belongsTo(models.Users, {
            onDelete: "cascade"
        });
    };

    return Submissions;
} 