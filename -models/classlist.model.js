const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        classid: { type: DataTypes.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true},
    
        subjectcode: {type: DataTypes.STRING(10), 
            allowNull: false,
            references: {
                model: 'subjectlists', 
                key: 'subjectcode' 
            }
        },

        semester: {
            type: DataTypes.STRING(6),
            allowNull: false,
            references: {
                model: 'semesterlists',
                key: 'semester' 
            }
        },

        year: {
            type: DataTypes.STRING(10),
            allowNull: false,
            references: {
                model: 'yearlists', 
                key: 'year' 
            }
        },

        teacherid: {type: DataTypes.INTEGER, allowNull: true}, // will add teacher id relationship to accounts model 

        created: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE},
        dateDeleted: { type: DataTypes.DATE},
        dateReactivated: { type: DataTypes.DATE},
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
        isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }

      
    };

    const options = {
        // disable default timestamp fields (createdAt and updatedAt)
        timestamps: false      
    };

    return sequelize.define('Classlist', attributes, options);
}