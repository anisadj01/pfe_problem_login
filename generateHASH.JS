const bcrypt = require("bcrypt");

const passwordToHash = "password123"; // Mot de passe à tester

bcrypt.hash(passwordToHash, 10, (err, hash) => {
    if (err) {
        console.error("❌ Erreur lors du hash :", err);
        return;
    }
    console.log("✅ Nouveau hash généré :", hash);
});
