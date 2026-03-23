const Client = require('../models/Client');

const getClients = async (req, res) => {
  const clients = await Client.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
  res.json(clients);
};

const createClient = async (req, res) => {
  const { name, email, phone, address, notes } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Client name is required');
  }

  const client = await Client.create({
    name,
    email,
    phone,
    address,
    notes,
    createdBy: req.user._id,
  });

  res.status(201).json(client);
};

const updateClient = async (req, res) => {
  const client = await Client.findOne({ _id: req.params.id, createdBy: req.user._id });

  if (!client) {
    res.status(404);
    throw new Error('Client not found');
  }

  Object.assign(client, req.body);
  const updated = await client.save();
  res.json(updated);
};

const deleteClient = async (req, res) => {
  const client = await Client.findOne({ _id: req.params.id, createdBy: req.user._id });

  if (!client) {
    res.status(404);
    throw new Error('Client not found');
  }

  await client.deleteOne();
  res.json({ message: 'Client deleted' });
};

module.exports = {
  getClients,
  createClient,
  updateClient,
  deleteClient,
};
