import api from './api';

export const askLegalAssistant = async (question) => {
  const { data } = await api.post('/chatbot/ask', { question });
  return data;
};
