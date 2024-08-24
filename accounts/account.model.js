const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        username: { type: DataTypes.STRING, allowNull: false },
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
       
        role: { type: DataTypes.STRING, allowNull: false },
        // verificationToken: { type: DataTypes.STRING },
        // verified: { type: DataTypes.DATE },
        resetToken: { type: DataTypes.STRING },
        resetTokenExpires: { type: DataTypes.DATE },
        passwordReset: { type: DataTypes.DATE },
        created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated: { type: DataTypes.DATE},
        dateDeleted: { type: DataTypes.DATE},
        dateReactivated: { type: DataTypes.DATE},
        isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
        isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
        // isVerified: {
        //     type: DataTypes.VIRTUAL,
        //     get() { return !!(this.verified || this.passwordReset); }
        // }
    };

    const options = {
        // disable default timestamp fields (createdAt and updatedAt)
        timestamps: false, 
        defaultScope: {
            // exclude password hash by default
            attributes: { exclude: ['passwordHash'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }        
    };

    return sequelize.define('account', attributes, options);
}