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
        totalattendance:{type: DataTypes.INTEGER, allowNull: true,defaultValue: 0 },
        perfectattendancescore:{type: DataTypes.INTEGER, allowNull: true,defaultValue: 0 },
        attendance5percent:{type: DataTypes.DOUBLE, allowNull: true,defaultValue: 0 },
        
        totalparticipation:{type: DataTypes.INTEGER, allowNull: true,defaultValue: 0 },
        perfectparticipationscore:{type: DataTypes.INTEGER, allowNull: true,defaultValue: 0 },
        participation5percent:{type: DataTypes.DOUBLE, allowNull: true,defaultValue: 0 },

        totalquiz:{type: DataTypes.INTEGER, allowNull: true,defaultValue: 0 },
        perfectquizscore:{type: DataTypes.INTEGER, allowNull: true,defaultValue: 0 },
        quiz15percent:{type: DataTypes.DOUBLE, allowNull: true,defaultValue: 0 },

        totalactivityproject:{type: DataTypes.INTEGER, allowNull: true,defaultValue: 0 },
        perfectactivityprojectscore:{type: DataTypes.INTEGER, allowNull: true,defaultValue: 0 },
        activityproject45percent:{type: DataTypes.DOUBLE, allowNull: true,defaultValue: 0 },

        totalexam:{type: DataTypes.INTEGER, allowNull: true,defaultValue: 0 },
        perfectexamscore:{type: DataTypes.INTEGER, allowNull: true,defaultValue: 0 },
        exam30percent:{type: DataTypes.DOUBLE, allowNull: true,defaultValue: 0 },

        finalcomputedgrade:{type: DataTypes.DOUBLE, allowNull: true,defaultValue: 0 },

        transmutedgrade:{type: DataTypes.DOUBLE, allowNull: true,defaultValue: 0 },

   

        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE},
    
       

    }; 

    const options = {
        
        timestamps: false
    };
    return sequelize.define('computedgradelist', attributes, options); 
}



 
