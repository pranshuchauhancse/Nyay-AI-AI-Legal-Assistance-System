const OpenAI = require('openai');

let client;

const getClient = () => {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
};

const askLegalQuestion = async (question) => {
  const openai = getClient();

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content:
          'You are Nyay-AI, a helpful legal assistant. Give clear, structured guidance for Indian legal contexts, include practical next steps, and add a short disclaimer that this is not a substitute for a licensed lawyer.',
      },
      {
        role: 'user',
        content: question,
      },
    ],
  });

  return completion.choices?.[0]?.message?.content || 'No response generated.';
};

module.exports = {
  askLegalQuestion,
};
