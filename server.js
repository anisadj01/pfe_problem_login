const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./config/database");
const Employee = require("./models/Employee"); // ✅ Import du modèle Employee
const Mission = require("./models/Mission"); // ✅ Import du modèle Mission
const Signalement = require("./models/Signalement");
const Justification = require("./models/Justification");
const fs = require("fs");
const path = require("path");
const uploadDir = path.join(__dirname, "uploads");



// Vérifier si le dossier "uploads" existe, sinon le créer
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


const app = express();

// ✅ Vérification de la connexion à MySQL
sequelize.authenticate()
  .then(() => console.log("✅ Connexion à MySQL réussie"))
  .catch(err => console.error("❌ Erreur de connexion à MySQL :", err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
const employeeRoutes = require("./routes/employee");
app.use("/api/employees", employeeRoutes);
const missionRoutes = require("./routes/mission"); // ✅ Import des routes de mission
app.use("/api/missions", missionRoutes); // ✅ Ajout des routes de mission
const signalementRoutes = require("./routes/signalement");
app.use("/api/signalements", signalementRoutes);
const justificationRoutes = require("./routes/justification");
app.use("/api/justifications", justificationRoutes);
const notificationRoutes = require("./routes/notification");
app.use("/api/notifications", notificationRoutes);



app.get("/", (req, res) => {
  res.send("🚀 API de gestion des ordres de mission Air Algérie en cours...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);

  await sequelize.sync({ alter: true }) // ✅ Met à jour sans supprimer les données
    .then(() => console.log("✅ Tables mises à jour avec succès"))
    .catch((err) => console.error("❌ Erreur lors de la mise à jour des tables :", err));
});