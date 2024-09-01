const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        examid: {
            type: DataTypes.INTEGER, allowNull: false, autoIncrement: true,primaryKey: true},
            isReference: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
            classid:{type: DataTypes.INTEGER, allowNull: false, 
            
                references: {
                    model: 'classlists', 
                    key: 'classid' 
                }
            },
        exam_1: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0 },   
       
        exam_total: { type: DataTypes.INTEGER,allowNull: true, defaultValue: 0 },
        exam_percentage:  { type: DataTypes.DOUBLE,allowNull: true, defaultValue: 0 },
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE}
    }; 

    const options = {
        
        timestamps: false
    };
    return sequelize.define('ExamScore', attributes, options); 
}

