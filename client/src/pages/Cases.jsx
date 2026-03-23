import { useEffect, useState } from 'react';
import api from '../services/api';
import { formatDate } from '../utils/formatDate';

const initialForm = {
  title: '',
  description: '',
  status: 'Open',
  priority: 'Medium',
  client: '',
};

export default function Cases() {
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(initialForm);

  const loadData = async () => {
    const [casesRes, clientsRes] = await Promise.all([api.get('/cases'), api.get('/clients')]);
    setCases(casesRes.data);
    setClients(clientsRes.data);
  };

  useEffect(() => {
    loadData().catch(() => {
      setCases([]);
      setClients([]);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    await api.post('/cases', form);
    setForm(initialForm);
    loadData();
  };

  return (
    <div className="page-grid two-col">
      <section className="card">
        <h3>Create Case</h3>
        <form className="stack-form" onSubmit={onSubmit}>
          <input
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Case title"
            required
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Case description"
            rows={3}
          />
          <select
            value={form.client}
            onChange={(e) => setForm((prev) => ({ ...prev, client: e.target.value }))}
            required
          >
            <option value="">Select client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>
          <div className="inline-row">
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Closed</option>
            </select>
            <select
              value={form.priority}
              onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <button className="btn-primary" type="submit">Create Case</button>
        </form>
      </section>
      <section className="card">
        <h3>Case List</h3>
        <div className="list-wrap">
          {cases.map((item) => (
            <article key={item._id} className="list-item">
              <h4>{item.title}</h4>
              <p>{item.description || 'No description'}</p>
              <small>
                {item.status} | {item.priority} | {item.client?.name || 'No client'} | Created {formatDate(item.createdAt)}
              </small>
            </article>
          ))}
          {!cases.length && <p>No cases found yet.</p>}
        </div>
      </section>
    </div>
  );
}
