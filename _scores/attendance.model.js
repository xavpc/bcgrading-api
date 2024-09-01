const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        attendanceid: {
            type: DataTypes.INTEGER, allowNull: false, autoIncrement: true,primaryKey: true},
            isReference: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
            classid:{type: DataTypes.INTEGER, allowNull: false, 
            
                references: {
                    model: 'classlists', 
                    key: 'classid' 
                }
            },
        
            attendancecounter: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 10},
        attendance_1: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0 },
        attendance_2: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0  },
        attendance_3: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
        attendance_4: { type: DataTypes.INTEGER,  allowNull: false,defaultValue: 0 },
        attendance_5: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0},
        attendance_6: { type: DataTypes.INTEGER, allowNull: false,defaultValue: 0 },
        attendance_7: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0},
        attendance_8: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0 },
        attendance_9: { type: DataTypes.INTEGER,allowNull: false, defaultValue: 0},
        attendance_10:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_11:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_12:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_13:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_14:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_15:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_16:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_17:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_18:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_19:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_20:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_21:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_22:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_23:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_24:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_25:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_26:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_27:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_28:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_29:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_30:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        attendance_total: { type: DataTypes.INTEGER,allowNull: true, defaultValue: 0 },
        attendance_percentage:  { type: DataTypes.DOUBLE,allowNull: true, defaultValue: 0 },
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE}
    }; 

    const options = {
        
        timestamps: false
    };
    return sequelize.define('AttendanceScore', attributes, options); 
}

