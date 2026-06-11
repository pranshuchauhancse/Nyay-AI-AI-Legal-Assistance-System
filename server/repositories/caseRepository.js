const Case = require('../models/Case');

const POPULATE_USERS = 'createdBy assignedTo citizen policeOfficer judge';
const POPULATE_FIELDS = 'name email role';

const findVisibleToUser = (filters) =>
  Case.find(filters)
    .populate(POPULATE_USERS, POPULATE_FIELDS)
    .sort({ createdAt: -1 });

const create = (payload) => Case.create(payload);

const findById = (id) => Case.findById(id);

const populateUsers = (legalCase) => legalCase.populate(POPULATE_USERS, POPULATE_FIELDS);

module.exports = {
  create,
  findById,
  findVisibleToUser,
  populateUsers,
};
