const assert = require('assert');
const {
  canDeleteCase,
  canTransition,
  canUpdateCase,
  validateCaseCreation,
  validateCaseUpdate,
} = require('../domain/caseWorkflow');

const ids = {
  citizen: '507f1f77bcf86cd799439021',
  lawyer: '507f1f77bcf86cd799439022',
  police: '507f1f77bcf86cd799439023',
  judge: '507f1f77bcf86cd799439024',
  admin: '507f1f77bcf86cd799439025',
  outsider: '507f1f77bcf86cd799439026',
};

const user = (role, id = ids[role]) => ({ _id: id, role });

const legalCase = {
  _id: '507f1f77bcf86cd799439030',
  status: 'Filed',
  createdBy: ids.citizen,
  assignedLawyer: ids.lawyer,
  policeOfficer: ids.police,
  judge: ids.judge,
};

const expectStatusCode = (fn, statusCode) => {
  assert.throws(fn, (error) => error.statusCode === statusCode);
};

console.log('\nCASE WORKFLOW TESTS\n');

assert.strictEqual(canTransition('Filed', 'Under Investigation'), true);
assert.strictEqual(canTransition('Filed', 'Resolved'), false);
assert.strictEqual(canTransition('Resolved', 'Closed'), true);
assert.strictEqual(canTransition('Closed', 'In Hearing'), false);
console.log('Passed: transition map enforces forward-only workflow');

assert.strictEqual(canUpdateCase(user('lawyer'), legalCase), true);
assert.strictEqual(canUpdateCase(user('citizen'), legalCase), true);
assert.strictEqual(canUpdateCase(user('citizen', ids.outsider), legalCase), false);
assert.strictEqual(canUpdateCase(user('admin'), legalCase), true);
console.log('Passed: participant update permissions are centralized');

assert.strictEqual(canDeleteCase(user('citizen'), legalCase), true);
assert.strictEqual(canDeleteCase(user('lawyer'), legalCase), false);
assert.strictEqual(canDeleteCase(user('admin'), legalCase), true);
console.log('Passed: delete permissions are centralized');

assert.doesNotThrow(() => validateCaseCreation(user('citizen'), { title: 'Tenant dispute' }));
expectStatusCode(
  () => validateCaseCreation(user('citizen'), { title: 'Tenant dispute', status: 'In Hearing' }),
  403
);
expectStatusCode(() => validateCaseCreation(user('citizen'), { title: '' }), 400);
console.log('Passed: creation rules reject invalid initial states');

assert.doesNotThrow(() =>
  validateCaseUpdate(user('police'), legalCase, { status: 'Under Investigation' })
);
expectStatusCode(
  () => validateCaseUpdate(user('police'), legalCase, { status: 'Resolved' }),
  400
);
expectStatusCode(
  () => validateCaseUpdate(user('citizen'), legalCase, { status: 'Under Investigation' }),
  403
);
console.log('Passed: updates reject invalid transitions and unauthorized status changes');

console.log('\nALL CASE WORKFLOW TESTS PASSED\n');
