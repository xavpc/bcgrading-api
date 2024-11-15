//grade.model.js   db.Gradelist
const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        gradeid: {
            type: DataTypes.INTEGER, allowNull: false, autoIncrement: true,primaryKey: true},
            classid:{type: DataTypes.INTEGER, allowNull: false, 
            
                references: {
                    model: 'externalclasslists', 
                    key: 'classid' 
                }
            },  
            attendanceDate:{type: DataTypes.DATEONLY, allowNull: true, },
        

        term:{type: DataTypes.STRING, allowNull: true, },
        scoretype:{type: DataTypes.STRING, allowNull: true, },
  
        perfectscore:{type: DataTypes.INTEGER, allowNull: true, },
   

        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE,allowNull: true,},
        
        active: {type: DataTypes.BOOLEAN, defaultValue: true}
  

    }; 

    const options = {
        tableName: 'gradelists',
        timestamps: false
    };
    return sequelize.define('Gradelist', attributes, options); 
}

