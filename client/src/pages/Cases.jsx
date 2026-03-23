import { useEffect, useState, useMemo } from 'react';
import api from '../services/api';
import { formatDate } from '../utils/formatDate';

const initialForm = {
  title: '',
  description: '',
  status: 'Open',
  priority: 'Medium',
  client: '',
  nextHearingDate: '',
};

export default function Cases() {
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      const [casesRes, clientsRes] = await Promise.all([api.get('/cases'), api.get('/clients')]);
      setCases(casesRes.data || []);
      setClients(clientsRes.data || []);
    } catch {
      setCases([]);
      setClients([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const totalCases = cases.length;
    const openCases = cases.filter(c => c.status === 'Open').length;
    const inProgress = cases.filter(c => c.status === 'In Progress').length;
    const closedCases = cases.filter(c => c.status === 'Closed').length;
    const highPriority = cases.filter(c => c.priority === 'High').length;
    return { totalCases, openCases, inProgress, closedCases, highPriority };
  }, [cases]);

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const statusMatch = filterStatus === 'All' || c.status === filterStatus;
      const priorityMatch = filterPriority === 'All' || c.priority === filterPriority;
      const searchMatch = !searchQuery || 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.client?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && priorityMatch && searchMatch;
    });
  }, [cases, filterStatus, filterPriority, searchQuery]);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(`/cases/${editingId}`, form);
      } else {
        await api.post('/cases', form);
      }
      setForm(initialForm);
      setEditingId(null);
      loadData();
    } catch (error) {
      console.error('Error saving case:', error);
    }
  };

  const onEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title,
      description: item.description || '',
      status: item.status,
      priority: item.priority,
      client: item.client?._id || '',
      nextHearingDate: item.nextHearingDate || '',
    });
  };

  const onDelete = async (id) => {
    try {
      await api.delete(`/cases/${id}`);
      if (editingId === id) {
        setForm(initialForm);
        setEditingId(null);
      }
      loadData();
    } catch (error) {
      console.error('Error deleting case:', error);
    }
  };

  const onCancelEdit = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return '#ff6b6b';
      case 'Medium': return '#ffa500';
      case 'Low': return '#51cf66';
      default: return '#666';
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Open': '🟢',
      'In Progress': '🟡',
      'Closed': '🔵'
    };
    return badges[status] || '⚪';
  };

  return (
    <div className="page-container">
      <section className="page-header card">
        <div>
          <h2>📋 Case Management</h2>
          <p>Manage legal cases, track status, priority, and client associations</p>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="stats-row">
        <article className="card stat-card">
          <h3>Total Cases</h3>
          <p>{stats.totalCases}</p>
        </article>
        <article className="card stat-card">
          <h3>Open Cases</h3>
          <p>{stats.openCases}</p>
        </article>
        <article className="card stat-card">
          <h3>In Progress</h3>
          <p>{stats.inProgress}</p>
        </article>
        <article className="card stat-card">
          <h3>Closed</h3>
          <p>{stats.closedCases}</p>
        </article>
        <article className="card stat-card">
          <h3>High Priority</h3>
          <p>{stats.highPriority}</p>
        </article>
        <article className="card stat-card">
          <h3>Total Clients</h3>
          <p>{clients.length}</p>
        </article>
      </section>

      <section className="page-grid two-col">
        {/* Create/Edit Form */}
        <section className="card">
          <h3>{editingId ? '✏️ Edit Case' : '➕ Create New Case'}</h3>
          <form className="stack-form" onSubmit={onSubmit}>
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Case title (e.g., Smith v. Johnson)"
              required
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Case details and description"
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
                  {client.name} ({client.email})
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
            <input
              type="date"
              value={form.nextHearingDate}
              onChange={(e) => setForm((prev) => ({ ...prev, nextHearingDate: e.target.value }))}
              placeholder="Next hearing date"
            />
            <div className="action-row">
              <button className="btn-primary" type="submit">
                {editingId ? '💾 Update Case' : '➕ Add Case'}
              </button>
              {editingId && (
                <button className="btn-secondary" type="button" onClick={onCancelEdit}>
                  ✕ Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Filter & Search */}
        <section className="card">
          <h3>🔍 Filter & Search</h3>
          <div className="stack-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, or client name"
            />
            <div className="inline-row">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option>All Statuses</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Closed</option>
              </select>
              <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                <option>All Priorities</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <small>{filteredCases.length} case(s) found</small>
          </div>
        </section>
      </section>

      {/* Cases List */}
      <section className="card">
        <h3>📂 All Cases ({filteredCases.length})</h3>
        <div className="list-wrap">
          {filteredCases.map((item) => (
            <article key={item._id} className="case-item">
              <div className="case-header">
                <h4>{getStatusBadge(item.status)} {item.title}</h4>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    background: getPriorityColor(item.priority), 
                    color: 'white', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {item.priority}
                  </span>
                  <span style={{ background: '#e8ebe8', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {item.status}
                  </span>
                </div>
              </div>
              <p className="case-desc">{item.description || '(No description)'}</p>
              <div className="case-meta">
                <span>👤 {item.client?.name || 'Unassigned'}</span>
                {item.nextHearingDate && <span>📅 Hearing: {formatDate(item.nextHearingDate)}</span>}
              </div>
              <div className="action-row">
                <button className="btn-secondary" onClick={() => onEdit(item)} type="button">✎ Edit</button>
                <button className="btn-danger" onClick={() => onDelete(item._id)} type="button">🗑️ Delete</button>
              </div>
            </article>
          ))}
          {!filteredCases.length && <p style={{ textAlign: 'center', color: '#999' }}>No cases yet. Create one above!</p>}
        </div>
      </section>
    </div>
  );
}
