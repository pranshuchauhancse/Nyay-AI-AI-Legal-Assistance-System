const normalizeRole = (role = '') => String(role).trim().toLowerCase();

const requireRole = (roles = []) => {
  const allowedRoles = (Array.isArray(roles) ? roles : [roles]).map(normalizeRole);

  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Authentication required');
    }

    if (!allowedRoles.includes(normalizeRole(req.user.role))) {
      res.status(403);
      throw new Error(`Forbidden: requires one of ${allowedRoles.join(', ')}`);
    }

    next();
  };
};

const allowRoles = (...roles) => requireRole(roles);

module.exports = {
  allowRoles,
  requireRole,
};
