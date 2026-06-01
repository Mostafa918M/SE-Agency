const projectService = require('../services/project.service');
const sendResponse = require('../utils/sendResponse');

/**
 * Controller for handling project-related requests.
 */
class ProjectController {
  /**
   * Create a new project with image and video file uploads.
   */
  async create(req, res) {
    try {
      const data = { ...req.body };

      // Handle multiple file upload fields
      if (req.files) {
        if (req.files.bannerImg) {
          data.bannerImg = `/uploads/${req.files.bannerImg[0].filename}`;
        }
        if (req.files.img) {
          data.img = `/uploads/${req.files.img[0].filename}`;
        }
        if (req.files.gallery) {
          data.gallery = req.files.gallery.map(file => `/uploads/${file.filename}`);
        }
        if (req.files.videoThumb) {
          data.videoThumb = `/uploads/${req.files.videoThumb[0].filename}`;
        }
        if (req.files.video) {
          data.video = `/uploads/${req.files.video[0].filename}`;
        }
      }

      // Parse JSON fields if they come as strings from multipart/form-data
      if (typeof data.categories === 'string') {
        data.categories = JSON.parse(data.categories);
      }
      
      // Convert boolean-like fields if they come as strings
      if (data.featured === 'true' || data.featured === 1) data.featured = true;
      if (data.featured === 'false' || data.featured === 0) data.featured = false;

      const project = await projectService.createProject(data);
      return sendResponse(res, 201, 'success', 'Project created successfully', { project });
    } catch (error) {
      return sendResponse(res, 400, 'fail', error.message || 'Failed to create project');
    }
  }

  /**
   * Get all projects.
   */
  async getAll(req, res) {
    try {
      const projects = await projectService.getAllProjects();
      return sendResponse(res, 200, 'success', 'Projects retrieved successfully', { projects });
    } catch (error) {
      return sendResponse(res, 500, 'error', 'Internal server error');
    }
  }

  /**
   * Get a single project.
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const project = await projectService.getProjectById(id);
      return sendResponse(res, 200, 'success', 'Project retrieved successfully', { project });
    } catch (error) {
      return sendResponse(res, 404, 'fail', error.message || 'Project not found');
    }
  }

  /**
   * Update a project with image and video file uploads.
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = { ...req.body };

      // Handle multiple file upload fields for update
      if (req.files) {
        if (req.files.bannerImg) {
          data.bannerImg = `/uploads/${req.files.bannerImg[0].filename}`;
        }
        if (req.files.img) {
          data.img = `/uploads/${req.files.img[0].filename}`;
        }
        if (req.files.gallery) {
          data.gallery = req.files.gallery.map(file => `/uploads/${file.filename}`);
        }
        if (req.files.videoThumb) {
          data.videoThumb = `/uploads/${req.files.videoThumb[0].filename}`;
        }
        if (req.files.video) {
          data.video = `/uploads/${req.files.video[0].filename}`;
        }
      }

      // Parse JSON fields if they come as strings
      if (typeof data.categories === 'string') {
        data.categories = JSON.parse(data.categories);
      }

      // Handle boolean-like fields from multipart/form-data
      if (data.featured === 'true' || data.featured === 1) data.featured = true;
      if (data.featured === 'false' || data.featured === 0) data.featured = false;

      const project = await projectService.updateProject(id, data);
      return sendResponse(res, 200, 'success', 'Project updated successfully', { project });
    } catch (error) {
      return sendResponse(res, 400, 'fail', error.message || 'Failed to update project');
    }
  }

  /**
   * Delete a project.
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      await projectService.deleteProject(id);
      return sendResponse(res, 200, 'success', 'Project deleted successfully');
    } catch (error) {
      return sendResponse(res, 404, 'fail', error.message || 'Project not found');
    }
  }
}

const controller = new ProjectController();
module.exports = {
  create: controller.create.bind(controller),
  getAll: controller.getAll.bind(controller),
  getById: controller.getById.bind(controller),
  update: controller.update.bind(controller),
  delete: controller.delete.bind(controller),
};
