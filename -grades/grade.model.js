const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        gradeid: {
            type: DataTypes.INTEGER, allowNull: false, autoIncrement: true,primaryKey: true},
        studentFirstName: {  type: DataTypes.STRING, allowNull: true },
        studentLastName: {  type: DataTypes.STRING, allowNull: true },
        studentid: {type: DataTypes.INTEGER, allowNull: false,
            references: {
                model: 'accounts', 
                key: 'id' 
            }
        },
        term:{type: DataTypes.STRING, allowNull: true, },

        classid:{type: DataTypes.INTEGER, allowNull: false, 
            
            references: {
                model: 'classlists', 
                key: 'classid' 
            }
        },

        attendanceid: {type: DataTypes.INTEGER, allowNull:true,

            references:{
                model: 'attendancescores',
                key: 'attendanceid'
            }
        },

        participationid: {type: DataTypes.INTEGER, allowNull:true,

            references:{
                model: 'participationscores',
                key: 'participationid'
            }
        },

        quizid: {type: DataTypes.INTEGER, allowNull:true,

            references:{
                model: 'quizscores',
                key: 'quizid'
            }
        },

        activityprojectid: {type: DataTypes.INTEGER, allowNull:true,

            references:{
                model: 'activityprojectscores',
                key: 'activityprojectid'
            }
        },

        examid: {type: DataTypes.INTEGER, allowNull:true,

            references:{
                model: 'examscores',
                key: 'examid'
            }
        },

        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE},
    
        
  

    }; 

    const options = {
        
        timestamps: false
    };
    return sequelize.define('Gradelist', attributes, options); 
}

