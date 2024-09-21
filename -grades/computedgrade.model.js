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
        attendance5percent:{type: DataTypes.DOUBLE, allowNull: true, },

        totalparticipation:{type: DataTypes.INTEGER, allowNull: true, },
        perfectparticipationscore:{type: DataTypes.INTEGER, allowNull: true, },
        participation5percent:{type: DataTypes.DOUBLE, allowNull: true, },

        totalquiz:{type: DataTypes.INTEGER, allowNull: true, },
        perfectquizscore:{type: DataTypes.INTEGER, allowNull: true, },
        participation15percent:{type: DataTypes.DOUBLE, allowNull: true, },

        totalactivityproject:{type: DataTypes.INTEGER, allowNull: true, },
        perfectactivityprojectscore:{type: DataTypes.INTEGER, allowNull: true, },
        activityproject45percent:{type: DataTypes.DOUBLE, allowNull: true, },

        totalexam:{type: DataTypes.INTEGER, allowNull: true, },
        perfectexamscore:{type: DataTypes.INTEGER, allowNull: true, },
        exam30percent:{type: DataTypes.DOUBLE, allowNull: true, },

        finalcomputedgrade:{type: DataTypes.DOUBLE, allowNull: true, },

        transmutedgrade:{type: DataTypes.DOUBLE, allowNull: true, },

   

        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE},
    
       

    }; 

    const options = {
        
        timestamps: false
    };
    return sequelize.define('ComputedGradelist', attributes, options); 
}



 
