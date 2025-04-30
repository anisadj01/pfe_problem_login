const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Employee = require("./Employee");

const Mission = sequelize.define("Mission", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM("En attente", "En cours", "Terminée"),
    defaultValue: "En attente",
  },
  means_of_transport: {
    type: DataTypes.ENUM("train", "avion", "taxi", "voiture_privee", "ferry", "bateau"),
    allowNull: false,
  },
  parcours: {
    type: DataTypes.JSON,
    defaultValue: [
      { departure_city: "", arrival_city: "", means_of_transport: "", observation: "" },
    ],
    validate: {
      isValidParcours(value) {
        if (!Array.isArray(value) || value.length < 1 || value.length > 4) {
          throw new Error("Le parcours doit contenir entre 1 et 4 trajets.");
        }
        if (!value[0].departure_city || value[0].departure_city.trim() === "") {
          throw new Error("La ville de départ 1 est obligatoire.");
        }
        if (!value[0].arrival_city || value[0].arrival_city.trim() === "") {
          throw new Error("La ville d'arrivée 1 est obligatoire.");
        }
        if (!value[0].means_of_transport || value[0].means_of_transport.trim() === "") {
          throw new Error("Le moyen de transport 1 est obligatoire.");
        }
      },
    },
  },
  emission_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  agent_signature: {
    type: DataTypes.STRING,
  },
  director_signature: {
    type: DataTypes.STRING,
  },
  general_director_signature: {
    type: DataTypes.STRING,
  },
});

// Relation : une mission appartient à un employé
Mission.belongsTo(Employee, { foreignKey: "employee_id", as: "employee" });

module.exports = Mission;