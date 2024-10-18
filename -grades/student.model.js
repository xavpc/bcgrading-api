//student.model.js
const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        studentgradeid: {
            type: DataTypes.INTEGER, allowNull: false, autoIncrement: true,primaryKey: true},
        studentid: {type: DataTypes.INTEGER, allowNull: false,
            references: {
                model: 'accounts', 
                key: 'id' 
            }
        },
        classid:{type: DataTypes.INTEGER, allowNull: false, 
            
            references: {
                model: 'externalclasslists', 
                key: 'classid' 
            }
        },  

        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE},
    
        
  

    }; 

    const options = {
        tableName: 'studentlists',
        timestamps: false,
        
    };
    return sequelize.define('Studentlist', attributes, options); 
}

