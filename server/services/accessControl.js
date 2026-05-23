/**
 * PHASE 2 - STEP 7: Central Permission Service
 * Provides utility functions for permission checks in controllers
 * 
 * Usage in controller:
 *   const canModify = await accessControl.canModify(
 *     user,
 *     'Case',
 *     caseId,
 *     'lawyerId'
 *   );
 */

const { hasPermission } = require('../policies/permissions');

class AccessControl {
  /**
   * Check if user can perform action on resource
   * @param {object} user - Authenticated user object
   * @param {string} permission - Permission to check (e.g., 'case:view')
   * @returns {boolean}
   */
  can(user, permission) {
    if (!user) return false;
    return hasPermission(user.role, permission);
  }

  /**
   * Check if user owns the resource
   * @param {object} user - Authenticated user object
   * @param {object} resource - Resource to check ownership
   * @param {string} ownershipField - Field name that contains owner ID
   * @returns {boolean}
   */
  owns(user, resource, ownershipField = 'userId') {
    if (!user || !resource) return false;
    
    // Admin owns everything
    if (user.role === 'admin') return true;

    const ownerId = resource[ownershipField];
    return ownerId && ownerId.toString() === user._id.toString();
  }

  /**
   * Check if user can view resource
   * @param {object} user - Authenticated user object
   * @param {object} resource - Resource to check
   * @param {string} permission - Specific permission to check
   * @param {string} ownershipField - Field for ownership check
   * @returns {boolean}
   */
  canView(user, resource, permission = 'view', ownershipField = 'userId') {
    // Admin can view everything
    if (user.role === 'admin') return true;

    // Check general permission
    if (!this.can(user, permission)) return false;

    // If resource provided, check ownership
    if (resource && ownershipField) {
      return this.owns(user, resource, ownershipField);
    }

    return true;
  }

  /**
   * Check if user can modify resource
   * @param {object} user - Authenticated user object
   * @param {object} resource - Resource to check
   * @param {string} permission - Specific permission to check (default: 'update')
   * @param {string} ownershipField - Field for ownership check
   * @returns {boolean}
   */
  canModify(user, resource, permission = 'update', ownershipField = 'userId') {
    // Admin can modify everything
    if (user.role === 'admin') return true;

    // Check permission
    if (!this.can(user, permission)) return false;

    // Check ownership
    if (resource && ownershipField) {
      return this.owns(user, resource, ownershipField);
    }

    return true;
  }

  /**
   * Check if user can delete resource
   * @param {object} user - Authenticated user object
   * @param {object} resource - Resource to check
   * @param {string} permission - Specific permission to check (default: 'delete')
   * @param {string} ownershipField - Field for ownership check
   * @returns {boolean}
   */
  canDelete(user, resource, permission = 'delete', ownershipField = 'userId') {
    // Only admin can delete
    if (user.role !== 'admin') return false;
    
    return this.can(user, permission);
  }

  /**
   * Check if user has role
   * @param {object} user - Authenticated user object
   * @param {string|string[]} roles - Role(s) to check
   * @returns {boolean}
   */
  hasRole(user, roles) {
    if (!user) return false;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  }

  /**
   * Check if user is admin
   * @param {object} user - Authenticated user object
   * @returns {boolean}
   */
  isAdmin(user) {
    return user && user.role === 'admin';
  }

  /**
   * Check if user is lawyer
   * @param {object} user - Authenticated user object
   * @returns {boolean}
   */
  isLawyer(user) {
    return user && user.role === 'lawyer';
  }

  /**
   * Check if user is citizen
   * @param {object} user - Authenticated user object
   * @returns {boolean}
   */
  isCitizen(user) {
    return user && user.role === 'citizen';
  }

  /**
   * Check if user is judge
   * @param {object} user - Authenticated user object
   * @returns {boolean}
   */
  isJudge(user) {
    return user && user.role === 'judge';
  }

  /**
   * Check if user is police
   * @param {object} user - Authenticated user object
   * @returns {boolean}
   */
  isPolice(user) {
    return user && user.role === 'police';
  }
}

// Export singleton instance
module.exports = new AccessControl();