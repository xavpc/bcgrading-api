const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        quizid: {
            type: DataTypes.INTEGER, allowNull: false, autoIncrement: true,primaryKey: true},
            isReference: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
            classid:{type: DataTypes.INTEGER, allowNull: false, 
            
                references: {
                    model: 'classlists', 
                    key: 'classid' 
                }
            },
        quiz_1: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0 },
        quiz_2: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0  },
        quiz_3: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        quiz_4: { type: DataTypes.INTEGER,  allowNull: false,defaultValue: 0 },
        quiz_5: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0},
        quiz_6: { type: DataTypes.INTEGER, allowNull: false,defaultValue: 0 },
        quiz_7: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0},
        quiz_8: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0 },
        quiz_9: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0},
        quiz_10:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
       
        quiz_total: { type: DataTypes.INTEGER,allowNull: true, defaultValue: 0 },
        quiz_percentage:  { type: DataTypes.DOUBLE,allowNull: true, defaultValue: 0 },
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE}
    }; 

    const options = {
        
        timestamps: false
    };
    return sequelize.define('QuizScore', attributes, options); 
}

