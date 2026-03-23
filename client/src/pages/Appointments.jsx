import { useState, useMemo } from 'react';

export default function Appointments() {
  const [items, setItems] = useState([
    { id: 1, title: 'Client Consultation', datetime: '2026-03-25T11:00', type: 'Client Meeting', location: 'Office' },
    { id: 2, title: 'Court Hearing', datetime: '2026-03-28T10:00', type: 'Court', location: 'District Court' },
  ]);
  const [form, setForm] = useState({ title: '', datetime: '', type: 'Client Meeting', location: '' });
  const [editingId, setEditingId] = useState(null);
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const appointmentTypes = ['Client Meeting', 'Court Hearing', 'Document Review', 'Team Meeting', 'Other'];

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return items.filter(item => new Date(item.datetime) >= now);
  }, [items]);

  const pastAppointments = useMemo(() => {
    const now = new Date();
    return items.filter(item => new Date(item.datetime) < now);
  }, [items]);

  const filteredAppointments = useMemo(() => {
    return items.filter(item => {
      const typeMatch = filterType === 'All' || item.type === filterType;
      const searchMatch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase());
      return typeMatch && searchMatch;
    });
  }, [items, filterType, searchQuery]);

  const stats = useMemo(() => {
    return {
      totalAppointments: items.length,
      upcoming: upcomingAppointments.length,
      past: pastAppointments.length,
      today: items.filter(item => {
        const itemDate = new Date(item.datetime);
        const today = new Date();
        return itemDate.toDateString() === today.toDateString();
      }).length,
    };
  }, [items, upcomingAppointments, pastAppointments]);

  const addAppointment = (event) => {
    event.preventDefault();
    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, title: form.title, datetime: form.datetime, type: form.type, location: form.location }
            : item
        )
      );
      setEditingId(null);
    } else {
      setItems((prev) => [
        { id: Date.now(), title: form.title, datetime: form.datetime, type: form.type, location: form.location },
        ...prev,
      ]);
    }
    setForm({ title: '', datetime: '', type: 'Client Meeting', location: '' });
  };

  const onEdit = (item) => {
    setEditingId(item.id);
    setForm({ title: item.title, datetime: item.datetime, type: item.type, location: item.location });
  };

  const onDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm({ title: '', datetime: '', type: 'Client Meeting', location: '' });
    }
  };

  const onCancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', datetime: '', type: 'Client Meeting', location: '' });
  };

  const getTypeColor = (type) => {
    const colors = {
      'Client Meeting': '#4e95c5',
      'Court Hearing': '#ff6b6b',
      'Document Review': '#51cf66',
      'Team Meeting': '#ffa500',
      'Other': '#9999cc'
    };
    return colors[type] || '#999';
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = (dateTime) => {
    return new Date(dateTime) >= new Date();
  };

  return (
    <div className="page-container">
      <section className="page-header card">
        <div>
          <h2>Appointment Scheduler</h2>
          <p>Manage client meetings, court hearings, document reviews, and other legal activities</p>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="stats-row">
        <article className="card stat-card">
          <h3>Total Appointments</h3>
          <p>{stats.totalAppointments}</p>
        </article>
        <article className="card stat-card">
          <h3>Upcoming</h3>
          <p>{stats.upcoming}</p>
        </article>
        <article className="card stat-card">
          <h3>Completed</h3>
          <p>{stats.past}</p>
        </article>
        <article className="card stat-card">
          <h3>Today</h3>
          <p>{stats.today}</p>
        </article>
        <article className="card stat-card">
          <h3>This Week</h3>
          <p>{items.filter(i => {
            const itemDate = new Date(i.datetime);
            const today = new Date();
            const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            return itemDate >= today && itemDate <= nextWeek;
          }).length}</p>
        </article>
        <article className="card stat-card">
          <h3>Client Meetings</h3>
          <p>{items.filter(i => i.type === 'Client Meeting').length}</p>
        </article>
      </section>

      <section className="page-grid two-col">
        {/* Add/Edit Form */}
        <section className="card">
          <h3>{editingId ? 'Edit Appointment' : 'Schedule New Appointment'}</h3>
          <form className="stack-form" onSubmit={addAppointment}>
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Appointment title (e.g., Client Consultation) *"
              required
            />
            <select
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
            >
              {appointmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={form.datetime}
              onChange={(e) => setForm((prev) => ({ ...prev, datetime: e.target.value }))}
              placeholder="Date and time *"
              required
            />
            <input
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Location (e.g., Office, Court, Virtual)"
            />
            <div className="action-row">
              <button className="btn-primary" type="submit">
                {editingId ? ' Update Appointment' : ' Add Appointment'}
              </button>
              {editingId && (
                <button className="btn-secondary" type="button" onClick={onCancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Filter & Search */}
        <section className="card">
          <h3>Filter and Search</h3>
          <div className="stack-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or location"
            />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="All">All Types</option>
              {appointmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <small>{filteredAppointments.length} appointment(s) found</small>
            <div style={{ marginTop: '12px', padding: '12px', background: '#f8faff', borderRadius: '8px' }}>
              <strong style={{ color: '#1e3833' }}>Pro Tip:</strong>
              <p style={{ margin: '4px 0 0', color: '#4e6661', fontSize: '0.9rem' }}>
                Set reminders before court dates and client meetings to stay organized.
              </p>
            </div>
          </div>
        </section>
      </section>

      {/* Upcoming Appointments */}
      {filteredAppointments.some(a => isUpcoming(a.datetime)) && (
        <section className="card">
          <h3>Upcoming Appointments ({filteredAppointments.filter(a => isUpcoming(a.datetime)).length})</h3>
          <div className="list-wrap">
            {filteredAppointments.filter(a => isUpcoming(a.datetime)).map((item) => (
              <article key={item.id} className="appointment-item" style={{ borderLeft: `4px solid ${getTypeColor(item.type)}` }}>
                <div className="appointment-header">
                  <h4>{item.title}</h4>
                  <span style={{ 
                    background: getTypeColor(item.type), 
                    color: 'white', 
                    padding: '4px 8px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {item.type}
                  </span>
                </div>
                <div className="appointment-details">
                  <span style={{ color: '#4e6661', fontSize: '0.9rem' }}>{formatDateTime(item.datetime)}</span>
                  {item.location && <span style={{ color: '#4e6661', fontSize: '0.9rem' }}>{item.location}</span>}
                </div>
                <div className="action-row">
                  <button className="btn-secondary" onClick={() => onEdit(item)} type="button">Edit</button>
                  <button className="btn-danger" onClick={() => onDelete(item.id)} type="button">Delete</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Past Appointments */}
      {items.some(a => !isUpcoming(a.datetime)) && (
        <section className="card">
          <h3>Completed Appointments ({items.filter(a => !isUpcoming(a.datetime)).length})</h3>
          <div className="list-wrap" style={{ opacity: 0.8 }}>
            {items.filter(a => !isUpcoming(a.datetime)).map((item) => (
              <article key={item.id} className="appointment-item">
                <div className="appointment-header">
                  <h4>{item.title}</h4>
                  <span style={{ 
                    background: '#999', 
                    color: 'white', 
                    padding: '4px 8px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    Completed
                  </span>
                </div>
                <div className="appointment-details">
                  <span style={{ color: '#4e6661', fontSize: '0.9rem' }}>{formatDateTime(item.datetime)}</span>
                  {item.location && <span style={{ color: '#4e6661', fontSize: '0.9rem' }}>{item.location}</span>}
                </div>
                <div className="action-row">
                  <button className="btn-danger" onClick={() => onDelete(item.id)} type="button">Delete</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {!items.length && (
        <section className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ color: '#999', fontSize: '1.1rem' }}>No appointments yet. Schedule your first one to get started.</p>
        </section>
      )}
    </div>
  );
}
