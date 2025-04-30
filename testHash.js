/***const bcrypt = require("bcrypt");

const passwordEntered = "password123";  // Mot de passe à tester
const hashedPassword = "$2b$10$XUQyJ3uZbO7fCQ8oBBO0qeVZCkbY1p0Y0OXH7sE8MCCmCzO8jWpaK"; // Hash stocké en BDD

bcrypt.compare(passwordEntered, hashedPassword, (err, result) => {
    if (err) {
        console.error("❌ Erreur bcrypt :", err);
        return;
    }

    if (result) {
        console.log("✅ Mot de passe valide !");
    } else {
        console.log("❌ Mot de passe incorrect !");
    }
});
**/