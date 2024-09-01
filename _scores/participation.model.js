const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        participationid: {
            type: DataTypes.INTEGER, allowNull: false, autoIncrement: true,primaryKey: true},
            isReference: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
            classid:{type: DataTypes.INTEGER, allowNull: false, 
            
                references: {
                    model: 'classlists', 
                    key: 'classid' 
                }
            },
        participation_1: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0 },
        participation_2: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0  },
        participation_3: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        participation_4: { type: DataTypes.INTEGER,  allowNull: false,defaultValue: 0 },
        participation_5: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0},
        participation_6: { type: DataTypes.INTEGER, allowNull: false,defaultValue: 0 },
        participation_7: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0},
        participation_8: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0 },
        participation_9: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0},
        participation_10:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
       
        participation_total: { type: DataTypes.INTEGER,allowNull: true, defaultValue: 0 },
        participation_percentage:  { type: DataTypes.DOUBLE,allowNull: true, defaultValue: 0 },
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE}
    }; 

    const options = {
        
        timestamps: false
    };
    return sequelize.define('ParticipationScore', attributes, options); 
}

