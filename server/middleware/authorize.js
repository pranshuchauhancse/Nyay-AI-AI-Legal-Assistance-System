/**
 * PHASE 2 - STEP 3: Authorization Middleware
 * Validates user permissions before allowing access to resources
 */

const { hasPermission } = require('../policies/permissions');

/**
 * Middleware to check if user has required permission(s)
 * @param {string|string[]} requiredPermissions - Permission(s) required
 * @param {boolean} requireAll - If true, user must have ALL permissions. If false, user needs ANY permission
 * @returns {function} Express middleware
 * 
 * Usage:
 *   router.post('/cases', authorize('case:create'), controller);
 *   router.get('/cases/:id', authorize(['case:view', 'case:update']), controller);
 */
const authorize = (requiredPermissions, requireAll = false) => {
  return (req, res, next) => {
    // Must be authenticated first (protect middleware should run first)
    if (!req.user) {
      res.status(401);
      throw new Error('Authentication required');
    }

    // Normalize permissions to array
    const permissions = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];

    // Check permissions
    let hasAccess = false;

    if (requireAll) {
      // User must have ALL permissions
      hasAccess = permissions.every(perm => hasPermission(req.user.role, perm));
    } else {
      // User must have AT LEAST ONE permission
      hasAccess = permissions.some(perm => hasPermission(req.user.role, perm));
    }

    if (!hasAccess) {
      res.status(403);
      throw new Error(
        `Access denied. Required permission(s): ${permissions.join(', ')}`
      );
    }

    // Store required permissions in request for logging/audit
    req.requiredPermissions = permissions;
    next();
  };
};

/**
 * Check resource ownership - user can only access their own resources
 * Typically called after authorize() middleware
 * 
 * Usage:
 *   router.get('/cases/:id', 
 *     protect, 
 *     authorize('case:view'), 
 *     checkOwnership('Case', 'citizenId'), 
 *     controller
 *   );
 */
const checkOwnership = (resourceModel, ownershipField = 'userId') => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // Admins can access everything
      if (req.user.role === 'admin') {
        return next();
      }

      // Find resource (dynamic require)
      const Model = require(`../models/${resourceModel}`);
      const resource = await Model.findById(id);

      if (!resource) {
        res.status(404);
        throw new Error(`${resourceModel} not found`);
      }

      // Check if user owns the resource
      // Handle different ownership field names
      const ownerId = resource[ownershipField];
      
      if (ownerId && ownerId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('You do not have access to this resource');
      }

      // Store resource in request for controller to use
      req.resource = resource;
      next();
    } catch (err) {
      if (res.statusCode < 400) {
        res.status(403);
      }
      throw err;
    }
  };
};

module.exports = {
  authorize,
  checkOwnership,
};