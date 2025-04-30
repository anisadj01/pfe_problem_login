const express = require("express");
const { authenticateUser, authorizeRole } = require("../middlewares/authMiddleware");
const Mission = require("../models/Mission");

const router = express.Router();

// 📌 Ajouter une mission
router.post("/", authenticateUser, authorizeRole(["manager"]), async (req, res) => {
  try {
    const {
      title,
      description,
      start_date,
      end_date,
      location,
      employee_id,
      means_of_transport,
      parcours,
      emission_date,
      agent_signature,
      director_signature,
      general_director_signature,
    } = req.body;

    // Validation
    if (!title || !start_date || !end_date || !means_of_transport || !emission_date || !parcours) {
      return res.status(400).json({ message: "Les champs obligatoires doivent être remplis" });
    }

    // Valider la structure de parcours
    if (!Array.isArray(parcours) || parcours.length < 1 || parcours.length > 4) {
      return res.status(400).json({ message: "Le parcours doit contenir entre 1 et 4 trajets" });
    }

    // Valider que le premier trajet a departure_city, arrival_city, et means_of_transport non vides
    if (!parcours[0].departure_city || parcours[0].departure_city.trim() === "") {
      return res.status(400).json({ message: "La ville de départ 1 est obligatoire" });
    }
    if (!parcours[0].arrival_city || parcours[0].arrival_city.trim() === "") {
      return res.status(400).json({ message: "La ville d'arrivée 1 est obligatoire" });
    }
    if (!parcours[0].means_of_transport || parcours[0].means_of_transport.trim() === "") {
      return res.status(400).json({ message: "Le moyen de transport 1 est obligatoire" });
    }

    const validatedParcours = parcours.map((dep) => ({
      departure_city: dep.departure_city || "",
      arrival_city: dep.arrival_city || "",
      means_of_transport: dep.means_of_transport || "",
      observation: dep.observation || "",
    }));

    const mission = await Mission.create({
      title,
      description,
      start_date,
      end_date,
      location,
      employee_id,
      means_of_transport,
      parcours: validatedParcours,
      emission_date,
      agent_signature,
      director_signature,
      general_director_signature,
    });

    res.status(201).json({ message: "Mission ajoutée avec succès", mission });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// 📌 Récupérer toutes les missions
router.get("/", authenticateUser, async (req, res) => {
  try {
    const missions = await Mission.findAll({ include: "employee" });
    res.json(missions);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// 📌 Modifier une mission
router.put("/:id", authenticateUser, authorizeRole(["manager"]), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      start_date,
      end_date,
      location,
      status,
      means_of_transport,
      parcours,
      emission_date,
      agent_signature,
      director_signature,
      general_director_signature,
    } = req.body;

    const mission = await Mission.findByPk(id);
    if (!mission) {
      return res.status(404).json({ message: "Mission non trouvée" });
    }

    // Validation
    if (!title || !start_date || !end_date || !means_of_transport || !emission_date || !parcours) {
      return res.status(400).json({ message: "Les champs obligatoires doivent être remplis" });
    }

    // Valider la structure de parcours
    if (!Array.isArray(parcours) || parcours.length < 1 || parcours.length > 4) {
      return res.status(400).json({ message: "Le parcours doit contenir entre 1 et 4 trajets" });
    }

    // Valider que le premier trajet a departure_city, arrival_city, et means_of_transport non vides
    if (!parcours[0].departure_city || parcours[0].departure_city.trim() === "") {
      return res.status(400).json({ message: "La ville de départ 1 est obligatoire" });
    }
    if (!parcours[0].arrival_city || parcours[0].arrival_city.trim() === "") {
      return res.status(400).json({ message: "La ville d'arrivée 1 est obligatoire" });
    }
    if (!parcours[0].means_of_transport || parcours[0].means_of_transport.trim() === "") {
      return res.status(400).json({ message: "Le moyen de transport 1 est obligatoire" });
    }

    const validatedParcours = parcours.map((dep) => ({
      departure_city: dep.departure_city || "",
      arrival_city: dep.arrival_city || "",
      means_of_transport: dep.means_of_transport || "",
      observation: dep.observation || "",
    }));

    await mission.update({
      title,
      description,
      start_date,
      end_date,
      location,
      status,
      means_of_transport,
      parcours: validatedParcours,
      emission_date,
      agent_signature,
      director_signature,
      general_director_signature,
    });

    res.json({ message: "Mission mise à jour avec succès", mission });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// 📌 Supprimer une mission
router.delete("/:id", authenticateUser, authorizeRole(["manager"]), async (req, res) => {
  try {
    const { id } = req.params;

    const mission = await Mission.findByPk(id);
    if (!mission) {
      return res.status(404).json({ message: "Mission non trouvée" });
    }

    await mission.destroy();
    res.json({ message: "Mission supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;