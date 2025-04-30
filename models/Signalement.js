const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Employee = require("./Employee");

const Signalement = sequelize.define("Signalement", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("En attente", "Résolu"),
    defaultValue: "En attente",
  },
});

// Relation : Un employé peut faire plusieurs signalements
Signalement.belongsTo(Employee, { foreignKey: "employee_id", as: "employee" });

module.exports = Signalement;