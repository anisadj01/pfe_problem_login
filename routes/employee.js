const express = require("express");
const bcrypt = require("bcrypt");
const Employee = require("../models/Employee");
const User = require("../models/User");
const { authenticateUser, authorizeRole } = require("../middlewares/authMiddleware");

const router = express.Router();

// ➕ Ajouter un employé (Manager uniquement)
router.post("/", authenticateUser, authorizeRole(["manager"]), async (req, res) => {
    try {
        const { name, email, phone, role, department } = req.body;

        // Vérifier si l'email est déjà utilisé dans Employee
        const existingEmployee = await Employee.findOne({ where: { email } });
        if (existingEmployee) return res.status(400).json({ message: "Email déjà utilisé pour un employé" });

        // Vérifier si l'email est déjà utilisé dans User
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email déjà utilisé pour un utilisateur" });

        // 🔐 Définir un mot de passe par défaut
        const defaultPassword = "12345678";
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // ➕ Créer un nouvel employé
        const employee = await Employee.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role,
            department
        });

        // ➕ Créer un compte utilisateur associé avec le champ name
        await User.create({
            name, // Ajout du champ name pour User
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            message: "Employé ajouté avec succès",
            employee: {
                id: employee.id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
                department: employee.department,
                password: defaultPassword // 📢 Mot de passe temporaire affiché pour l'employé
            }
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'employé :", error);
        res.status(500).json({ message: "Erreur lors de l'ajout de l'employé", error });
    }
});

// 🔍 Récupérer tous les employés (Manager uniquement)
router.get("/", authenticateUser, authorizeRole(["manager"]), async (req, res) => {
    try {
        const employees = await Employee.findAll({ attributes: { exclude: ["password"] } }); // Exclure les mots de passe
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des employés", error });
    }
});

// 🔍 Récupérer un employé par ID (Manager uniquement)
router.get("/:id", authenticateUser, authorizeRole(["manager"]), async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id, { attributes: { exclude: ["password"] } });
        if (!employee) return res.status(404).json({ message: "Employé non trouvé" });
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de l'employé", error });
    }
});

// ✏️ Mettre à jour un employé (hors mot de passe)
router.put("/:id", authenticateUser, authorizeRole(["manager"]), async (req, res) => {
    try {
        const { name, email, phone, role, department } = req.body;
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ message: "Employé non trouvé" });

        await employee.update({ name, email, phone, role, department });
        res.status(200).json({ message: "Employé mis à jour avec succès", employee });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'employé", error });
    }
});

// ❌ Supprimer un employé
router.delete("/:id", authenticateUser, authorizeRole(["manager"]), async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ message: "Employé non trouvé" });

        await employee.destroy();
        res.status(200).json({ message: "Employé supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'employé", error });
    }
});

module.exports = router;