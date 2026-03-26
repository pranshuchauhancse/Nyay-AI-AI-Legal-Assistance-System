import { useState } from 'react';
import { askLegalAssistant } from '../services/chatbotService';

export default function ChatbotWidget() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('Ask a legal question to get started.');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = await askLegalAssistant(question);
      const finalAnswer = [data.answer, data.disclaimer].filter(Boolean).join('\n\n');
      setAnswer(finalAnswer);
    } catch (error) {
      setAnswer(error.response?.data?.message || 'Could not reach legal assistant right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card chatbot-card">
      <h3>AI Chatbot</h3>
      <form className="chat-form" onSubmit={onSubmit}>
        <textarea
          rows={4}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask legal questions"
          required
        />
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>
      <p className="info-text">This is not a substitute for professional legal advice</p>
      <div className="chat-answer">{answer}</div>
    </section>
  );
}
