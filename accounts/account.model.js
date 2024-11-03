//account.model.js
const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
          },
          
        username: { type: DataTypes.STRING, allowNull: true },
        passwordHash: { type: DataTypes.STRING, allowNull: true },     
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

    const Account = sequelize.define('account', attributes, options);

    // Set the starting auto-increment value to 3000 after the model is created
    Account.sync().then(() => {
        sequelize.query(`ALTER TABLE accounts AUTO_INCREMENT = 3000;`);
    });

    return Account;
}