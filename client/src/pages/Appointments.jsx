import { useState } from 'react';

export default function Appointments() {
  const [items, setItems] = useState([
    { id: 1, title: 'Client Consultation', datetime: '2026-03-25T11:00' },
  ]);
  const [form, setForm] = useState({ title: '', datetime: '' });

  const addAppointment = (event) => {
    event.preventDefault();
    setItems((prev) => [
      { id: Date.now(), title: form.title, datetime: form.datetime },
      ...prev,
    ]);
    setForm({ title: '', datetime: '' });
  };

  return (
    <div className="page-grid two-col">
      <section className="card">
        <h3>Schedule Appointment</h3>
        <form className="stack-form" onSubmit={addAppointment}>
          <input
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Appointment title"
            required
          />
          <input
            type="datetime-local"
            value={form.datetime}
            onChange={(e) => setForm((prev) => ({ ...prev, datetime: e.target.value }))}
            required
          />
          <button className="btn-primary" type="submit">Add Appointment</button>
        </form>
      </section>
      <section className="card">
        <h3>Upcoming Appointments</h3>
        <div className="list-wrap">
          {items.map((item) => (
            <article key={item.id} className="list-item">
              <h4>{item.title}</h4>
              <small>{new Date(item.datetime).toLocaleString('en-IN')}</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
