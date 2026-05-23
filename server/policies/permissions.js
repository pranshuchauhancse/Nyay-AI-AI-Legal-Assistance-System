/**
 * PHASE 2 - STEP 2: RBAC Definitions
 * Define all roles and their associated permissions
 */

const ROLES = {
  CITIZEN: 'citizen',
  LAWYER: 'lawyer',
  JUDGE: 'judge',
  POLICE: 'police',
  ADMIN: 'admin',
};

/**
 * Permission structure: "resource" or "resource:action"
 * Resources: user, case, appointment, client, report, judgment, hearing
 * Actions: view, create, update, delete, manage
 */

const PERMISSIONS = {
  // Citizen permissions
  [ROLES.CITIZEN]: [
    'case:view',      // View own cases
    'case:create',    // Create new case
    'appointment:view', // View own appointments
    'appointment:create', // Book appointments
    'profile:view',
    'profile:update',
    'chatbot:use',    // Use AI chatbot
  ],

  // Lawyer permissions
  [ROLES.LAWYER]: [
    'case:view',      // View assigned cases
    'case:update',    // Update assigned cases
    'client:view',    // View own clients
    'client:create',  // Add new client
    'appointment:view', // View appointments
    'appointment:create',
    'profile:view',
    'profile:update',
    'chatbot:use',
    'report:create',  // Create case reports
  ],

  // Judge permissions
  [ROLES.JUDGE]: [
    'case:view',      // View assigned cases
    'judgment:create', // Create/update judgments
    'judgment:view',
    'hearing:view',   // View hearings
    'hearing:update', // Schedule/update hearings
    'profile:view',
    'profile:update',
    'chatbot:use',
  ],

  // Police permissions
  [ROLES.POLICE]: [
    'report:create',  // Create investigation reports
    'report:view',    // View own reports
    'case:view',      // View related cases
    'profile:view',
    'profile:update',
    'chatbot:use',
  ],

  // Admin permissions - can do everything
  [ROLES.ADMIN]: [
    'user:view',
    'user:create',
    'user:update',
    'user:delete',
    'case:view',
    'case:update',
    'case:delete',
    'appointment:view',
    'appointment:delete',
    'report:view',
    'report:delete',
    'system:manage', // Access admin panels
    'audit:view',    // View audit logs
  ],
};

/**
 * Check if a role has a specific permission
 * @param {string} role - User role
 * @param {string} permission - Permission to check (e.g., 'case:view')
 * @returns {boolean}
 */
const hasPermission = (role, permission) => {
  const rolePermissions = PERMISSIONS[role] || [];
  return rolePermissions.includes(permission) || rolePermissions.includes(permission.split(':')[0]);
};

/**
 * Check if a role has any of the given permissions
 * @param {string} role - User role
 * @param {string[]} permissions - Permissions to check
 * @returns {boolean}
 */
const hasAnyPermission = (role, permissions = []) => {
  return permissions.some(permission => hasPermission(role, permission));
};

/**
 * Check if a role has all of the given permissions
 * @param {string} role - User role
 * @param {string[]} permissions - Permissions to check
 * @returns {boolean}
 */
const hasAllPermissions = (role, permissions = []) => {
  return permissions.every(permission => hasPermission(role, permission));
};

module.exports = {
  ROLES,
  PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
};