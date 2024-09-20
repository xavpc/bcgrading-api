//db.ComputedGradelist
const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        computedgradeid: {
            type: DataTypes.INTEGER, allowNull: false, autoIncrement: true,primaryKey: true},
        
    classid:{type: DataTypes.INTEGER, allowNull: false, 
            
        references: {
            model: 'classlists', 
            key: 'classid' 
        }
    }, 
        studentgradeid: {type: DataTypes.INTEGER, allowNull: false,
            references: {
                model: 'studentlists', 
                key: 'studentgradeid' 
            }
        },
        term:{type: DataTypes.STRING, allowNull: true, },
        totalattendance:{type: DataTypes.INTEGER, allowNull: true, },
        perfectattendancescore:{type: DataTypes.INTEGER, allowNull: true, },
    


   

        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE},
    
       

    }; 

    const options = {
        
        timestamps: false
    };
    return sequelize.define('ComputedGradelist', attributes, options); 
}



 
        //     gradeid:{
        //         type: DataTypes.INTEGER, allowNull: false,
        //         references: {
        //             model: 'gradelists', 
        //             key: 'gradeid' 
        //         }
        //     },

        
      // attendancepercentage:{type: DataTypes.DOUBLE, allowNull: true, },