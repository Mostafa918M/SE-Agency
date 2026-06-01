const Client = require('../models/client.model');

/**
 * Service for managing client-related data and logic.
 */
class ClientService {
  /**
   * Create a new client.
   */
  async createClient(clientData) {
    const client = new Client(clientData);
    await client.save();
    return client;
  }

  /**
   * Get all clients.
   */
  async getAllClients() {
    return await Client.find().sort({ order: 1, name: 1 });
  }

  /**
   * Get client by ID.
   */
  async getClientById(id) {
    const client = await Client.findById(id);
    if (!client) throw new Error('Client not found');
    return client;
  }

  /**
   * Update a client.
   */
  async updateClient(id, updateData) {
    const client = await Client.findByIdAndUpdate(id, updateData, { new: true });
    if (!client) throw new Error('Client not found');
    return client;
  }

  /**
   * Delete a client.
   */
  async deleteClient(id) {
    const client = await Client.findByIdAndDelete(id);
    if (!client) throw new Error('Client not found');
    return client;
  }
}

module.exports = new ClientService();
