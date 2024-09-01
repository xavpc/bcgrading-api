const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        activityprojectid: {
            type: DataTypes.INTEGER, allowNull: false, autoIncrement: true,primaryKey: true},
            isReference: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
            classid:{type: DataTypes.INTEGER, allowNull: false, 
            
                references: {
                    model: 'classlists', 
                    key: 'classid' 
                }
            },
        activityproject_1: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0 },
        activityproject_2: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0  },
        activityproject_3: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        activityproject_4: { type: DataTypes.INTEGER,  allowNull: false,defaultValue: 0 },
        activityproject_5: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0},
        activityproject_6: { type: DataTypes.INTEGER, allowNull: false,defaultValue: 0 },
        activityproject_7: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0},
        activityproject_8: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0 },
        activityproject_9: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0},
        activityproject_10:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
       
        activityproject_total: { type: DataTypes.INTEGER,allowNull: true, defaultValue: 0 },
        activityproject_percentage:  { type: DataTypes.DOUBLE,allowNull: true, defaultValue: 0 },
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE}
    }; 

    const options = {
        
        timestamps: false
    };
    return sequelize.define('ActivityProjectScore', attributes, options); 
}

