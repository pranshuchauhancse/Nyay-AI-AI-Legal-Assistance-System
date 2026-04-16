import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import { createUser, deleteUser, getUserActivity, getUsers } from '../../services/userService';
import { ROLE_LABELS, ROLES } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

const SUPER_ADMIN_EMAILS = ['pranshu121005@gmail.com', 'rohitchauhan200207@gmail.com'];
const PROTECTED_ADMIN_EMAILS = [...SUPER_ADMIN_EMAILS];

export default function ManageUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen' });
  const [message, setMessage] = useState('');
  const [activity, setActivity] = useState(null);
  const [loadingActivity, setLoadingActivity] = useState(false);

  const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(
    String(currentUser?.email || '').trim().toLowerCase()
  );

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

  const onCreate = async (event) => {
    event.preventDefault();
    try {
      await createUser(form);
      setForm({ name: '', email: '', password: '', role: 'citizen' });
      setMessage('User created successfully.');
      loadUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not create user.');
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteUser(id);
      setMessage('User deleted successfully.');
      loadUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not delete user.');
    }
  };

  const onViewActivity = async (userId) => {
    setLoadingActivity(true);
    try {
      const data = await getUserActivity(userId);
      setActivity(data);
    } catch (error) {
      setActivity(null);
      setMessage(error.response?.data?.message || 'Could not load user activity.');
    } finally {
      setLoadingActivity(false);
    }
  };

  return (
    <PageTemplate title="Manage Users" description="Add and remove users across all roles.">
      <section className="page-grid two-col">
        <article className="card">
          <h3>Add User</h3>
          <form className="stack-form" onSubmit={onCreate}>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Name"
              required
            />
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="Password"
              minLength={6}
              required
            />
            <select
              value={form.role}
              onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
            >
              {(isSuperAdmin ? ROLES : ROLES.filter((role) => role !== 'admin')).map((role) => (
                <option key={role} value={role}>{ROLE_LABELS[role]}</option>
              ))}
            </select>
            <button className="btn-primary" type="submit">Add User</button>
          </form>
          {message && <p className="info-text">{message}</p>}
        </article>

        <article className="card">
          <h3>User List</h3>
          <div className="list-wrap">
            {users.map((item) => (
              <div className="list-item" key={item._id}>
                <h4>{item.name}</h4>
                <p>{item.email} | {ROLE_LABELS[item.role] || item.role}</p>
                <div className="action-row">
                  <button className="btn-secondary" type="button" onClick={() => onViewActivity(item._id)}>
                    View Activity
                  </button>
                  {(!PROTECTED_ADMIN_EMAILS.includes(String(item.email || '').trim().toLowerCase())
                    && (item.role !== 'admin' || isSuperAdmin)) && (
                    <button className="btn-danger" type="button" onClick={() => onDelete(item._id)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
            {!users.length && <p>No users found.</p>}
          </div>
        </article>
      </section>

      <section className="card">
        <h3>User Activity Detail</h3>
        {loadingActivity && <p>Loading user activity...</p>}
        {!loadingActivity && !activity && <p>Click on any user to view full activity.</p>}
        {!loadingActivity && activity && (
          <div className="page-container">
            <article className="summary-item">
              <span>{activity.user.name} ({activity.user.email})</span>
              <strong>{ROLE_LABELS[activity.user.role] || activity.user.role}</strong>
            </article>

            <section className="stats-row">
              <article className="card stat-card"><h3>Cases</h3><p>{activity.summary.totalCases}</p></article>
              <article className="card stat-card"><h3>Appointments</h3><p>{activity.summary.totalAppointments}</p></article>
              <article className="card stat-card"><h3>Reports</h3><p>{activity.summary.totalReports}</p></article>
            </section>

            <section className="page-grid two-col">
              <article className="card list-wrap">
                <h4>Recent Cases</h4>
                {activity.cases.map((item) => (
                  <div className="list-item" key={item._id}>
                    <strong>{item.title}</strong>
                    <p>{item.status}</p>
                  </div>
                ))}
                {!activity.cases.length && <p>No case activity.</p>}
              </article>

              <article className="card list-wrap">
                <h4>Recent Appointments</h4>
                {activity.appointments.map((item) => (
                  <div className="list-item" key={item._id}>
                    <strong>{item.title}</strong>
                    <p>{item.status}</p>
                  </div>
                ))}
                {!activity.appointments.length && <p>No appointment activity.</p>}
              </article>
            </section>

            <article className="card list-wrap">
              <h4>Recent Reports</h4>
              {activity.reports.map((item) => (
                <div className="list-item" key={item._id}>
                  <strong>{item.title}</strong>
                  <p>{item.type} | {item.status}</p>
                </div>
              ))}
              {!activity.reports.length && <p>No report activity.</p>}
            </article>
          </div>
        )}
      </section>
    </PageTemplate>
  );
}
