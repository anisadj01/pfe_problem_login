const express = require("express");
const { authenticateUser, authorizeRole } = require("../middlewares/authMiddleware");
const Signalement = require("../models/Signalement");
const Notification = require("../models/Notification");

const router = express.Router();

// 📌 Ajouter un signalement avec notification
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { description } = req.body;
    const employee_id = req.user.id; // ID de l'employé connecté

    // 📌 Création du signalement
    const signalement = await Signalement.create({
      description, // Correction du champ reason → description
      employee_id,
      status: "En attente", // Ajout d'un statut par défaut
    });

    // ✅ Générer une notification pour le manager
    await Notification.create({
      message: `Un nouvel incident a été signalé par un employé.`,
      type: "signalement",
    });

    res.status(201).json({ message: "Signalement ajouté avec succès", signalement });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// 📌 Récupérer tous les signalements (uniquement pour le manager)
router.get("/", authenticateUser, authorizeRole(["manager"]), async (req, res) => {
  try {
    const signalements = await Signalement.findAll();
    res.json(signalements);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// 📌 Supprimer un signalement (uniquement le manager)
router.delete("/:id", authenticateUser, authorizeRole(["manager"]), async (req, res) => {
  try {
    const signalement = await Signalement.findByPk(req.params.id);
    if (!signalement) {
      return res.status(404).json({ message: "Signalement non trouvé" });
    }

    await signalement.destroy();
    res.json({ message: "Signalement supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;