export const ROLES = ['citizen', 'lawyer', 'judge', 'police', 'admin'];

export const AUTH_ROLES = ['citizen', 'lawyer', 'judge', 'police'];

export const ROLE_LABELS = {
  citizen: 'Citizen',
  lawyer: 'Lawyer',
  judge: 'Judge',
  police: 'Police',
  admin: 'Admin',
};

export const ROLE_HOME = {
  citizen: '/citizen/dashboard',
  lawyer: '/lawyer/dashboard',
  judge: '/judge/dashboard',
  police: '/police/dashboard',
  admin: '/admin/dashboard',
};

export const getRoleHome = (role) => ROLE_HOME[role] || '/login';

export const getRoleLinks = (role) => {
  const common = [
    { to: '/chatbot', label: 'Chatbot' },
  ];

  const map = {
    citizen: [
      { to: '/citizen/dashboard', label: 'Dashboard' },
      { to: '/citizen/my-cases', label: 'My Cases' },
      { to: '/citizen/case-status', label: 'Case Status' },
      { to: '/citizen/book-appointment', label: 'Book Appointment' },
    ],
    lawyer: [
      { to: '/lawyer/dashboard', label: 'Dashboard' },
      { to: '/lawyer/assigned-cases', label: 'Assigned Cases' },
      { to: '/lawyer/client-list', label: 'Client List' },
      { to: '/lawyer/update-case', label: 'Update Case' },
      { to: '/lawyer/schedule-meeting', label: 'Schedule Meeting' },
    ],
    judge: [
      { to: '/judge/dashboard', label: 'Dashboard' },
      { to: '/judge/case-list', label: 'Case List' },
      { to: '/judge/hearing-schedule', label: 'Hearing Schedule' },
      { to: '/judge/update-judgment', label: 'Update Judgment' },
    ],
    police: [
      { to: '/police/dashboard', label: 'Dashboard' },
      { to: '/police/fir-complaints', label: 'FIR Complaints' },
      { to: '/police/investigation-status', label: 'Investigation Status' },
      { to: '/police/upload-reports', label: 'Upload Reports' },
    ],
    admin: [
      { to: '/admin/dashboard', label: 'Dashboard' },
      { to: '/admin/manage-users', label: 'Manage Users' },
      { to: '/admin/manage-roles', label: 'Manage Roles' },
      { to: '/admin/all-cases', label: 'All Cases' },
      { to: '/admin/reports', label: 'Reports' },
    ],
  };

  return [...(map[role] || []), ...common];
};
