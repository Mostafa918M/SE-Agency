const clientService = require('../services/client.service');
const sendResponse = require('../utils/sendResponse');

class ClientController {
  /**
   * Get all clients.
   */
  async getAll(req, res) {
    try {
      const clients = await clientService.getAllClients();
      return sendResponse(res, 200, 'success', 'Clients retrieved successfully', { clients });
    } catch (error) {
      return sendResponse(res, 500, 'error', 'Internal server error');
    }
  }

  /**
   * Create a new client.
   */
  async create(req, res) {
    try {
      const data = { ...req.body };
      if (req.file) {
        data.logo = `/uploads/${req.file.filename}`;
      }
      const client = await clientService.createClient(data);
      return sendResponse(res, 201, 'success', 'Client created successfully', { client });
    } catch (error) {
      return sendResponse(res, 400, 'fail', error.message || 'Failed to create client');
    }
  }

  /**
   * Update a client.
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = { ...req.body };
      if (req.file) {
        data.logo = `/uploads/${req.file.filename}`;
      }
      const client = await clientService.updateClient(id, data);
      return sendResponse(res, 200, 'success', 'Client updated successfully', { client });
    } catch (error) {
      return sendResponse(res, 400, 'fail', error.message || 'Failed to update client');
    }
  }

  /**
   * Delete a client.
   */
  async delete(req, res) {
     try {
       const { id } = req.params;
       await clientService.deleteClient(id);
       return sendResponse(res, 200, 'success', 'Client deleted successfully');
     } catch (error) {
       return sendResponse(res, 404, 'fail', error.message || 'Client not found');
     }
  }
}

const controller = new ClientController();
module.exports = {
  getAll: controller.getAll.bind(controller),
  create: controller.create.bind(controller),
  update: controller.update.bind(controller),
  delete: controller.delete.bind(controller),
};
