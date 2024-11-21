//student.model.js
const { types } = require('joi');
const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        studentgradeid: {
            type: DataTypes.INTEGER, allowNull: false, autoIncrement: true,primaryKey: true},

            student_id:{ type: DataTypes.STRING, allowNull: false},
            student_personal_id: {type: DataTypes.INTEGER, allowNull: false},
        // studentid: {type: DataTypes.INTEGER, allowNull: false,
        //     references: {
        //         model: 'accounts', 
        //         key: 'id' 
        //     }
        // },
        studentName:{ type: DataTypes.STRING, allowNull: true },

        classid:{type: DataTypes.INTEGER, allowNull: false, 
            
            references: {
                model: 'externalclasslists', 
                key: 'classid' 
            }
        },  

    
        
  

    }; 

    const options = {
        tableName: 'studentlists',
        timestamps: false,
        
    };
    return sequelize.define('Studentlist', attributes, options); 
}

