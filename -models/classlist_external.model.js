//classlist_external.model.js
const {isSchema} = require("joi");
const {DataTypes} = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    classid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },

    subjectcode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    semester: {
      type: DataTypes.STRING(20), // Updated length
      allowNull: false,
    },

    year: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    // Teacher
    teacherid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "accounts",
        key: "id",
      },
    },

    schedule: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  };

  const options = {
    timestamps: true,
    id: false, 
  };

  return sequelize.define("externalclasslist", attributes, options);
  
}
