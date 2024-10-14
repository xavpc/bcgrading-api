const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: false,
          },
          
        username: { type: DataTypes.STRING, allowNull: false },
        passwordHash: { type: DataTypes.STRING, allowNull: false },     
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },     
        role: { type: DataTypes.STRING, allowNull: false }, // Teacher
        resetToken: { type: DataTypes.STRING },
        resetTokenExpires: { type: DataTypes.DATE },
        passwordReset: { type: DataTypes.DATE },
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE},
        dateDeleted: { type: DataTypes.DATE},
        dateReactivated: { type: DataTypes.DATE},
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
        isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
   
    };

    const options = {
      
        timestamps: false, 
        defaultScope: {
        
            attributes: { exclude: ['passwordHash'] }
        },
        scopes: {
  
            withHash: { attributes: {}, }
        }        
    };

    return sequelize.define('account', attributes, options);
}