const { askLegalQuestion } = require('../services/aiService');

const askChatbot = async (req, res) => {
  const { question } = req.body;

  if (!question) {
    res.status(400);
    throw new Error('Question is required');
  }

  const answer = await askLegalQuestion(question);

  res.json({
    question,
    answer,
    disclaimer: 'This is not a substitute for professional legal advice',
  });
};

module.exports = {
  askChatbot,
};
