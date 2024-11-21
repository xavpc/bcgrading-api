//db.ComputedGradelist
const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        computedgradeid: {
            type: DataTypes.INTEGER, allowNull: false, autoIncrement: true,primaryKey: true},
        
    classid:{type: DataTypes.INTEGER, allowNull: false, 
            
        references: {
            model: 'externalclasslists', 
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

        transmutedgrade:{ type: DataTypes.DECIMAL(2, 1), allowNull: true,defaultValue: 5.0,  get() {
            const value = this.getDataValue('transmutedgrade');
            // Remove trailing zeros (e.g., convert "5.00" to "5.0")
            return Number(value).toFixed(1);
        } },

   

        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE},
    
       

    }; 

    const options = {
tableName: 'computedgradelists',
timestamps: false
    };
    return sequelize.define('ComputedGradelist', attributes, options); 
}



 
