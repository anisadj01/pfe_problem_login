const express = require("express");
const { authenticateUser } = require("../middlewares/authMiddleware");
const Notification = require("../models/Notification");

const router = express.Router();

// 📌 Récupérer toutes les notifications (uniquement pour le manager),lister.
router.get("/", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const notifications = await Notification.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// 📌 Marquer une notification comme lue
router.put("/:id/read", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification non trouvée" });
    }

    notification.read = true;
    await notification.save();

    res.json({ message: "Notification marquée comme lue", notification });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// 📌 Supprimer une notification
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification non trouvée" });
    }

    await notification.destroy();
    res.json({ message: "Notification supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;