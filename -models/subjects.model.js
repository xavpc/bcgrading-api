const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        subjectcode: {type: DataTypes.STRING(10), allowNull: false, primaryKey: true},
        title: {type: DataTypes.STRING, allowNull: false},
        created: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE},
        dateDeleted: { type: DataTypes.DATE},
        dateReactivated: { type: DataTypes.DATE},
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
        isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },

     
    };

    const options = {
        
        timestamps: false, 
           
    };

    return sequelize.define('Subjectlist', attributes, options);
}
