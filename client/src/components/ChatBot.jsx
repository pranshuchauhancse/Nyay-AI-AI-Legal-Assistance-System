import { useState } from 'react';
import api from '../services/api';

export default function ChatBot() {
  const [question, setQuestion] = useState('What are the basic steps to file a civil case in India?');
  const [answer, setAnswer] = useState('Ask Nyay-AI any legal workflow question to get started.');
  const [loading, setLoading] = useState(false);

  const askQuestion = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/ai/ask', { question });
      setAnswer(data.answer);
    } catch (error) {
      setAnswer(error.response?.data?.message || 'Could not reach AI assistant right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card chatbot-card">
      <h3>AI Legal Assistant</h3>
      <form onSubmit={askQuestion} className="chat-form">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
          placeholder="Describe your legal question"
          required
        />
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Thinking...' : 'Ask AI'}
        </button>
      </form>
      <div className="chat-answer">{answer}</div>
    </section>
  );
}
