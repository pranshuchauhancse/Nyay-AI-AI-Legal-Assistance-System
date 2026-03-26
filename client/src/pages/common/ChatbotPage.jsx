import ChatbotWidget from '../../components/ChatbotWidget';
import PageTemplate from '../PageTemplate';

export default function ChatbotPage() {
  return (
    <PageTemplate
      title="Legal AI Chatbot"
      description="Ask legal questions and get AI-assisted guidance."
    >
      <ChatbotWidget />
    </PageTemplate>
  );
}
