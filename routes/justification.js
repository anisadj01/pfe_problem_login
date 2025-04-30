const express = require("express");
const { authenticateUser } = require("../middlewares/authMiddleware");
const Justification = require("../models/Justification");
const upload = require("../config/multer");
const Notification = require("../models/Notification");

const router = express.Router();

// 📌 Ajouter une justification avec fichier
router.post("/", authenticateUser, upload.single("file"), async (req, res) => {
  try {
    const { reason } = req.body;
    const employee_id = req.user.id; // ID de l'employé connecté
    const file_path = req.file ? req.file.path : null; // Chemin du fichier

    const justification = await Justification.create({
      reason,
      file_path,
      employee_id,
    });

    // ✅ Générer une notification pour le manager
    await Notification.create({
      message: "Un employé a soumis une justification d'absence.",
      type: "justification",
    });

    res.status(201).json({ message: "Justification ajoutée avec succès", justification });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// 📌 Récupérer toutes les justifications (uniquement pour le manager)
router.get("/", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const justifications = await Justification.findAll();
    res.json(justifications);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// 📌 Récupérer une justification par ID
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const justification = await Justification.findByPk(req.params.id);

    if (!justification) {
      return res.status(404).json({ message: "Justification non trouvée" });
    }

    res.json(justification);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// 📌 Supprimer une justification (uniquement le manager)
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const justification = await Justification.findByPk(req.params.id);
    if (!justification) {
      return res.status(404).json({ message: "Justification non trouvée" });
    }

    await justification.destroy();
    res.json({ message: "Justification supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;