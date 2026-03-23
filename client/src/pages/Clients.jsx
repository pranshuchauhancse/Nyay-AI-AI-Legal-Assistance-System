import { useEffect, useState, useMemo } from 'react';
import api from '../services/api';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  notes: '',
};

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadClients = async () => {
    try {
      const { data } = await api.get('/clients');
      setClients(data || []);
    } catch {
      setClients([]);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const stats = useMemo(() => {
    return {
      totalClients: clients.length,
      emailCount: clients.filter(c => c.email).length,
      phoneCount: clients.filter(c => c.phone).length,
      withNotes: clients.filter(c => c.notes?.trim()).length,
    };
  }, [clients]);

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const searchMatch = !searchQuery || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone?.includes(searchQuery);
      return searchMatch;
    });
  }, [clients, searchQuery]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(`/clients/${editingId}`, form);
      } else {
        await api.post('/clients', form);
      }
      setForm(initialForm);
      setEditingId(null);
      loadClients();
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const onEdit = (client) => {
    setEditingId(client._id);
    setForm({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      notes: client.notes || '',
    });
  };

  const onDelete = async (id) => {
    try {
      await api.delete(`/clients/${id}`);
      if (editingId === id) {
        setForm(initialForm);
        setEditingId(null);
      }
      loadClients();
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const onCancelEdit = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const getContactStatus = (client) => {
    const hasEmail = !!client.email;
    const hasPhone = !!client.phone;
    if (hasEmail && hasPhone) return 'Complete';
    if (hasEmail || hasPhone) return 'Partial';
    return 'Missing';
  };

  return (
    <div className="page-container">
      <section className="page-header card">
        <div>
          <h2>Client Management</h2>
          <p>Manage client information, contact details, and case associations</p>
        </div>
      </section>

      <section className="stats-row">
        <article className="card stat-card">
          <h3>Total Clients</h3>
          <p>{stats.totalClients}</p>
        </article>
        <article className="card stat-card">
          <h3>With Email</h3>
          <p>{stats.emailCount}</p>
        </article>
        <article className="card stat-card">
          <h3>With Phone</h3>
          <p>{stats.phoneCount}</p>
        </article>
        <article className="card stat-card">
          <h3>With Notes</h3>
          <p>{stats.withNotes}</p>
        </article>
        <article className="card stat-card">
          <h3>Completion Rate</h3>
          <p>{stats.totalClients ? Math.round((stats.emailCount / stats.totalClients) * 100) : 0}%</p>
        </article>
        <article className="card stat-card">
          <h3>Contact Info</h3>
          <p>{stats.phoneCount + stats.emailCount}</p>
        </article>
      </section>

      <section className="page-grid two-col">
        <section className="card">
          <h3>{editingId ? 'Edit Client' : 'Add New Client'}</h3>
          <form className="stack-form" onSubmit={onSubmit}>
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Full name *"
              required
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Email address"
            />
            <input
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="Phone number (e.g., +91-XXXXXXXXXX)"
            />
            <input
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Address (street, city, state)"
            />
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes, case history, or special instructions"
            />
            <div className="action-row">
              <button className="btn-primary" type="submit">
                {editingId ? ' Update Client' : ' Add Client'}
              </button>
              {editingId && (
                <button className="btn-secondary" type="button" onClick={onCancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card">
          <h3>Search and Filter</h3>
          <div className="stack-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone"
            />
            <small>{filteredClients.length} client(s) found</small>
            <div style={{ marginTop: '12px', padding: '12px', background: '#f8faff', borderRadius: '8px' }}>
              <strong style={{ color: '#1e3833' }}>Quick Tips:</strong>
              <ul className="plain-list" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                <li>Keep contact info updated for better case management</li>
                <li>Add detailed notes for complex client histories</li>
                <li>Link clients to multiple cases for tracking</li>
              </ul>
            </div>
          </div>
        </section>
      </section>

      <section className="card">
        <h3>All Clients ({filteredClients.length})</h3>
        <div className="list-wrap">
          {filteredClients.map((client) => (
            <article key={client._id} className="client-item">
              <div className="client-header">
                <div>
                  <h4>{client.name}</h4>
                  <p style={{ margin: '4px 0 0', color: '#4e6661', fontSize: '0.9rem' }}>
                    {getContactStatus(client)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <small style={{ color: '#4e6661' }}>ID: {client._id?.slice(-6)}</small>
                </div>
              </div>

              <div className="client-details">
                {client.email && (
                  <div className="detail-row">
                    <span style={{ color: '#4e6661', fontSize: '0.9rem' }}>Email:</span>
                    <a href={`mailto:${client.email}`} style={{ color: '#1f6b5d', textDecoration: 'none', fontWeight: '600' }}>
                      {client.email}
                    </a>
                  </div>
                )}
                {client.phone && (
                  <div className="detail-row">
                    <span style={{ color: '#4e6661', fontSize: '0.9rem' }}>Phone:</span>
                    <a href={`tel:${client.phone}`} style={{ color: '#1f6b5d', textDecoration: 'none', fontWeight: '600' }}>
                      {client.phone}
                    </a>
                  </div>
                )}
                {client.address && (
                  <div className="detail-row">
                    <span style={{ color: '#4e6661', fontSize: '0.9rem' }}>Address:</span>
                    <span style={{ fontWeight: '500' }}>{client.address}</span>
                  </div>
                )}
                {client.notes && (
                  <div className="detail-row">
                    <span style={{ color: '#4e6661', fontSize: '0.9rem' }}>Notes:</span>
                    <span style={{ fontStyle: 'italic', color: '#39544f' }}>{client.notes}</span>
                  </div>
                )}
              </div>

              <div className="action-row">
                <button className="btn-secondary" onClick={() => onEdit(client)} type="button">Edit</button>
                <button className="btn-danger" onClick={() => onDelete(client._id)} type="button">Delete</button>
              </div>
            </article>
          ))}
          {!filteredClients.length && (
            <p style={{ textAlign: 'center', color: '#999', padding: '24px' }}>
              {searchQuery ? 'No clients match your search.' : 'No clients yet. Add one to get started!'}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
