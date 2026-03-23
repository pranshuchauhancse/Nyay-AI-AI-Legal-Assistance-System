import { useEffect, useState } from 'react';
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

  const loadClients = async () => {
    const { data } = await api.get('/clients');
    setClients(data);
  };

  useEffect(() => {
    loadClients().catch(() => setClients([]));
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    await api.post('/clients', form);
    setForm(initialForm);
    loadClients();
  };

  return (
    <div className="page-grid two-col">
      <section className="card">
        <h3>Add Client</h3>
        <form className="stack-form" onSubmit={onSubmit}>
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Client name"
            required
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Email"
          />
          <input
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="Phone"
          />
          <input
            value={form.address}
            onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
            placeholder="Address"
          />
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Notes"
          />
          <button className="btn-primary" type="submit">Save Client</button>
        </form>
      </section>
      <section className="card">
        <h3>Client Directory</h3>
        <div className="list-wrap">
          {clients.map((client) => (
            <article key={client._id} className="list-item">
              <h4>{client.name}</h4>
              <p>{client.email || 'No email'} | {client.phone || 'No phone'}</p>
              <small>{client.address || 'No address'}</small>
            </article>
          ))}
          {!clients.length && <p>No clients found yet.</p>}
        </div>
      </section>
    </div>
  );
}
