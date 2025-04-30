const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Justification = sequelize.define("Justification", {
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: true, // Un fichier peut être optionnel
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Justification;