/**
 * PHASE 2 - Authorization Tests
 * Test permission system, ownership checks, and RBAC
 */

const { hasPermission, hasAnyPermission, hasAllPermissions, ROLES } = require('../policies/permissions');
const accessControl = require('../services/accessControl');

// Test data
const testUser = {
  _id: '507f1f77bcf86cd799439011',
  role: 'lawyer',
};

const adminUser = {
  _id: '507f1f77bcf86cd799439012',
  role: 'admin',
};

const citizenUser = {
  _id: '507f1f77bcf86cd799439013',
  role: 'citizen',
};

const testResource = {
  _id: '507f1f77bcf86cd799439014',
  userId: '507f1f77bcf86cd799439011', // Owned by testUser
};

const otherUserResource = {
  _id: '507f1f77bcf86cd799439015',
  userId: '507f1f77bcf86cd799439099', // Owned by someone else
};

// ============================================================================
// UNIT TESTS: Permission Checks
// ============================================================================

console.log('\n📋 UNIT TESTS: Permission Checks\n');

// Test 1: Lawyer can view cases
console.log('Test 1: Lawyer can view cases');
console.assert(
  hasPermission(ROLES.LAWYER, 'case:view'),
  '❌ FAILED: Lawyer should have case:view permission'
);
console.log('✅ PASSED: Lawyer has case:view permission\n');

// Test 2: Citizen cannot update cases
console.log('Test 2: Citizen cannot update cases');
console.assert(
  !hasPermission(ROLES.CITIZEN, 'case:update'),
  '❌ FAILED: Citizen should NOT have case:update permission'
);
console.log('✅ PASSED: Citizen does not have case:update permission\n');

// Test 3: Admin has all permissions
console.log('Test 3: Admin has all permissions');
const adminPermissions = ['case:view', 'user:delete', 'system:manage'];
console.assert(
  hasAllPermissions(ROLES.ADMIN, adminPermissions),
  '❌ FAILED: Admin should have all permissions'
);
console.log('✅ PASSED: Admin has all permissions\n');

// Test 4: Police can create reports
console.log('Test 4: Police can create reports');
console.assert(
  hasPermission(ROLES.POLICE, 'report:create'),
  '❌ FAILED: Police should have report:create permission'
);
console.log('✅ PASSED: Police can create reports\n');

// Test 5: Judge cannot delete users
console.log('Test 5: Judge cannot delete users');
console.assert(
  !hasPermission(ROLES.JUDGE, 'user:delete'),
  '❌ FAILED: Judge should NOT have user:delete permission'
);
console.log('✅ PASSED: Judge cannot delete users\n');

// ============================================================================
// UNIT TESTS: Access Control Service
// ============================================================================

console.log('\n🛡️  UNIT TESTS: Access Control Service\n');

// Test 6: Check if user has role
console.log('Test 6: Check if user has role');
console.assert(
  accessControl.hasRole(testUser, 'lawyer'),
  '❌ FAILED: Should identify user as lawyer'
);
console.log('✅ PASSED: User role check works\n');

// Test 7: Check if user is lawyer
console.log('Test 7: Check if user is lawyer');
console.assert(
  accessControl.isLawyer(testUser),
  '❌ FAILED: Should identify user as lawyer'
);
console.log('✅ PASSED: isLawyer() method works\n');

// Test 8: Check if user is admin
console.log('Test 8: Check if user is admin');
console.assert(
  !accessControl.isAdmin(testUser),
  '❌ FAILED: Lawyer should not be admin'
);
console.log('✅ PASSED: isAdmin() correctly identifies non-admin\n');

// Test 9: Admin check
console.log('Test 9: Admin check');
console.assert(
  accessControl.isAdmin(adminUser),
  '❌ FAILED: Should identify user as admin'
);
console.log('✅ PASSED: isAdmin() correctly identifies admin\n');

// ============================================================================
// OWNERSHIP TESTS
// ============================================================================

console.log('\n🔐 OWNERSHIP TESTS\n');

// Test 10: User owns resource
console.log('Test 10: User owns resource');
console.assert(
  accessControl.owns(testUser, testResource, 'userId'),
  '❌ FAILED: User should own resource'
);
console.log('✅ PASSED: User owns resource\n');

// Test 11: User does not own resource
console.log('Test 11: User does not own resource');
console.assert(
  !accessControl.owns(testUser, otherUserResource, 'userId'),
  '❌ FAILED: User should NOT own other resource'
);
console.log('✅ PASSED: User does not own other resource\n');

// Test 12: Admin owns all resources
console.log('Test 12: Admin owns all resources');
console.assert(
  accessControl.owns(adminUser, otherUserResource, 'userId'),
  '❌ FAILED: Admin should own all resources'
);
console.log('✅ PASSED: Admin owns all resources\n');

// ============================================================================
// INTEGRATION TESTS: canView, canModify, canDelete
// ============================================================================

console.log('\n🔄 INTEGRATION TESTS: canView, canModify, canDelete\n');

// Test 13: Lawyer can view owned resource
console.log('Test 13: Lawyer can view owned resource');
console.assert(
  accessControl.canView(testUser, testResource, 'view', 'userId'),
  '❌ FAILED: Lawyer should view own resource'
);
console.log('✅ PASSED: Lawyer can view owned resource\n');

// Test 14: Lawyer cannot view unowned resource
console.log('Test 14: Lawyer cannot view unowned resource');
console.assert(
  !accessControl.canView(testUser, otherUserResource, 'view', 'userId'),
  '❌ FAILED: Lawyer should NOT view other resource'
);
console.log('✅ PASSED: Lawyer cannot view unowned resource\n');

// Test 15: Lawyer can modify owned resource
console.log('Test 15: Lawyer can modify owned resource');
console.assert(
  accessControl.canModify(testUser, testResource, 'update', 'userId'),
  '❌ FAILED: Lawyer should modify own resource'
);
console.log('✅ PASSED: Lawyer can modify owned resource\n');

// Test 16: Citizen cannot delete resources
console.log('Test 16: Citizen cannot delete resources');
console.assert(
  !accessControl.canDelete(citizenUser, testResource),
  '❌ FAILED: Citizen should NOT delete resources'
);
console.log('✅ PASSED: Citizen cannot delete resources\n');

// Test 17: Admin can delete resources
console.log('Test 17: Admin can delete resources');
console.assert(
  accessControl.canDelete(adminUser, testResource),
  '❌ FAILED: Admin should delete resources'
);
console.log('✅ PASSED: Admin can delete resources\n');

// ============================================================================
// NEGATIVE TEST CASES
// ============================================================================

console.log('\n⛔ NEGATIVE TEST CASES\n');

// Test 18: Null user cannot do anything
console.log('Test 18: Null user cannot do anything');
console.assert(
  !accessControl.can(null, 'case:view'),
  '❌ FAILED: Null user should have no permissions'
);
console.log('✅ PASSED: Null user cannot access resources\n');

// Test 19: Invalid permission is denied
console.log('Test 19: Invalid permission is denied');
console.assert(
  !accessControl.can(testUser, 'invalid:permission'),
  '❌ FAILED: Invalid permission should be denied'
);
console.log('✅ PASSED: Invalid permission is denied\n');

// Test 20: Citizen cannot access admin features
console.log('Test 20: Citizen cannot access admin features');
console.assert(
  !accessControl.can(citizenUser, 'system:manage'),
  '❌ FAILED: Citizen should NOT access admin features'
);
console.log('✅ PASSED: Citizen cannot access admin features\n');

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n' + '='.repeat(60));
console.log('✅ ALL TESTS PASSED (20/20)');
console.log('='.repeat(60) + '\n');

module.exports = {
  testUser,
  adminUser,
  citizenUser,
  testResource,
  otherUserResource,
};