import { useEffect, useState } from 'react';
import PageTemplate from '../PageTemplate';
import api from '../../services/api';

export default function ClientListPage() {
  const [clients, setClients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', notes: '' });

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

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(`/clients/${editingId}`, form);
        setMessage('Client updated successfully.');
      } else {
        await api.post('/clients', form);
        setMessage('Client added successfully.');
      }

      setForm({ name: '', email: '', phone: '', address: '', notes: '' });
      setEditingId(null);
      loadClients();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not save client.');
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || '',
      email: item.email || '',
      phone: item.phone || '',
      address: item.address || '',
      notes: item.notes || '',
    });
  };

  const onDelete = async (id) => {
    try {
      await api.delete(`/clients/${id}`);
      setMessage('Client deleted successfully.');
      if (editingId === id) {
        setEditingId(null);
        setForm({ name: '', email: '', phone: '', address: '', notes: '' });
      }
      loadClients();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not delete client.');
    }
  };

  return (
    <PageTemplate title="Client List" description="Manage and review your clients.">
      <section className="stats-row">
        <article className="card stat-card"><h3>Total Clients</h3><p>{clients.length}</p></article>
        <article className="card stat-card"><h3>With Phone</h3><p>{clients.filter((c) => c.phone).length}</p></article>
        <article className="card stat-card"><h3>With Email</h3><p>{clients.filter((c) => c.email).length}</p></article>
      </section>

      <section className="page-grid two-col">
        <article className="card">
          <h3>{editingId ? 'Edit Client' : 'Add Client'}</h3>
          <form className="stack-form" onSubmit={onSubmit}>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Client name" required />
            <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email" />
            <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone" />
            <input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} placeholder="Address" />
            <textarea rows={3} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Notes" />
            <div className="action-row">
              <button className="btn-primary" type="submit">{editingId ? 'Update' : 'Add'}</button>
              {editingId && (
                <button className="btn-secondary" type="button" onClick={() => {
                  setEditingId(null);
                  setForm({ name: '', email: '', phone: '', address: '', notes: '' });
                }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
          {message && <p className="info-text">{message}</p>}
        </article>

        <article className="card list-wrap">
          <h3>Client Records</h3>
          {clients.map((item) => (
            <article key={item._id} className="list-item">
              <h4>{item.name}</h4>
              <p>{item.email || 'No email'} | {item.phone || 'No phone'}</p>
              <small>{item.address || 'No address provided'}</small>
              <div className="action-row">
                <button className="btn-secondary" type="button" onClick={() => onEdit(item)}>Edit</button>
                <button className="btn-danger" type="button" onClick={() => onDelete(item._id)}>Delete</button>
              </div>
            </article>
          ))}
          {!clients.length && <p>No clients found.</p>}
        </article>
      </section>
    </PageTemplate>
  );
}
