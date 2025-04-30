const jwt = require('jsonwebtoken');

// Middleware d'authentification
const authenticateUser = (req, res, next) => {
  let token = req.header('Authorization');
  console.log('🔍 Token reçu:', token);

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé, token manquant' });
  }

  // Supprimer "Bearer " s'il est présent
  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('✅ Token valide, utilisateur:', decoded);
    next();
  } catch (error) {
    console.error('❌ Erreur de vérification du token:', error.name, error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expirée, veuillez vous reconnecter' });
    }
    return res.status(403).json({ message: 'Token invalide', error: error.message });
  }
};

// Middleware d'autorisation par rôle
const authorizeRole = (roles) => {
  return (req, res, next) => {
    console.log('🔒 Vérification rôle:', req.user?.role, 'Rôles attendus:', roles);
    if (!req.user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    // Normaliser la casse pour éviter les erreurs
    const userRole = req.user.role.toLowerCase();
    const allowedRoles = roles.map((role) => role.toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      console.log(`Rôle non autorisé: ${userRole}, rôles attendus: ${allowedRoles}`);
      return res.status(403).json({ message: 'Accès interdit' });
    }

    next();
  };
};

module.exports = { authenticateUser, authorizeRole };