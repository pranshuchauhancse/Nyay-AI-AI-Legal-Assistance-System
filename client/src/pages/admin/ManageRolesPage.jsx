import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import { getUsers, updateUser } from '../../services/userService';
import { ROLE_LABELS, ROLES } from '../../utils/helpers';

const PROTECTED_ADMIN_EMAILS = ['pranshu121005@gmail.com', 'rohitchauhan200207@gmail.com'];

export default function ManageRolesPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onRoleChange = async (userId, role) => {
    try {
      await updateUser(userId, { role });
      setMessage('Role updated successfully.');
      loadUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not update role.');
    }
  };

  return (
    <PageTemplate title="Manage Roles" description="Assign and update user roles.">
      <section className="card list-wrap">
        {users.map((item) => (
          <article key={item._id} className="list-item">
            <h4>{item.name}</h4>
            <p>{item.email}</p>
            <select
              value={item.role}
              disabled={PROTECTED_ADMIN_EMAILS.includes(String(item.email || '').trim().toLowerCase())}
              onChange={(event) => onRoleChange(item._id, event.target.value)}
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>{ROLE_LABELS[role]}</option>
              ))}
            </select>
            {PROTECTED_ADMIN_EMAILS.includes(String(item.email || '').trim().toLowerCase()) && (
              <small className="info-text">Protected real admin account</small>
            )}
          </article>
        ))}
        {!users.length && <p>No users available.</p>}
      </section>
      {message && <p className="info-text">{message}</p>}
    </PageTemplate>
  );
}
