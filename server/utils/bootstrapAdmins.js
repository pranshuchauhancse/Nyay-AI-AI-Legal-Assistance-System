const User = require('../models/User');

const DEFAULT_ADMINS = [
  {
    name: 'Pranshu Chauhan',
    email: 'pranshu121005@gmail.com',
    password: 'pranshu@2005',
    role: 'admin',
  },
  {
    name: 'Rohit Chauhan',
    email: 'rohitchauhan200207@gmail.com',
    password: 'rohit@2018',
    role: 'admin',
  },
];

const ensureDefaultAdmins = async () => {
  for (const admin of DEFAULT_ADMINS) {
    const existing = await User.findOne({ email: admin.email });

    if (!existing) {
      await User.create(admin);
      continue;
    }

    let changed = false;

    if (existing.role !== 'admin') {
      existing.role = 'admin';
      changed = true;
    }

    if (existing.name !== admin.name) {
      existing.name = admin.name;
      changed = true;
    }

    if (changed) {
      await existing.save();
    }
  }
};

module.exports = {
  ensureDefaultAdmins,
};
