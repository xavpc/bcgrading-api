const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        semester: {
            type: DataTypes.STRING(6), allowNull: false,primaryKey: true},
            created: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
            updated: { type: DataTypes.DATE},
            dateDeleted: { type: DataTypes.DATE},
            dateReactivated: { type: DataTypes.DATE},
            isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
            isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
   

    };

    const options = {
        // disable default timestamp fields (createdAt and updatedAt)
        timestamps: false,
    };

    return sequelize.define('Semesterlist', attributes, options);  // Use 'SemesterList' as the model name
}
