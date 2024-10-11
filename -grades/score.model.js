//db.Scorelist
const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        scoreid: {
            type: DataTypes.INTEGER, allowNull: false, autoIncrement: true,primaryKey: true},
            gradeid:{
                type: DataTypes.INTEGER, allowNull: false,
                references: {
                    model: 'gradelists', 
                    key: 'gradeid' 
                }
            },

        studentgradeid: {type: DataTypes.INTEGER, allowNull: false,
            references: {
                model: 'studentlists', 
                key: 'studentgradeid' 
            }
        },

        attendanceDate:{type: DataTypes.DATEONLY, allowNull: true, },
        attendanceStatus:{type: DataTypes.STRING, allowNull: true, defaultValue: ''},

        term:{type: DataTypes.STRING, allowNull: true, },
        scoretype:{type: DataTypes.STRING, allowNull: true, },
        score:{type: DataTypes.INTEGER, allowNull: true, },
        perfectscore:{type: DataTypes.INTEGER, allowNull: true, },
   

        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE},
    
        
  

    }; 

    const options = {
        
        timestamps: false
    };
    return sequelize.define('scorelist', attributes, options); 
}

