const Project = require('../models/project.model');
const fs = require('fs');
const path = require('path');

/**
 * Service for managing project-related data and logic.
 */
class ProjectService {
  /**
   * Private helper to delete project files from the local filesystem.
   */
  async deleteProjectFiles(project) {
    const filesToDelete = [];
    
    if (project.bannerImg) filesToDelete.push(project.bannerImg);
    if (project.img) filesToDelete.push(project.img);
    if (project.videoThumb) filesToDelete.push(project.videoThumb);
    if (project.video) filesToDelete.push(project.video);
    if (project.gallery && project.gallery.length > 0) {
      filesToDelete.push(...project.gallery);
    }

    filesToDelete.forEach(filePath => {
      // Remove leading slash for local disk path joining
      const relativePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
      const fullPath = path.join(process.cwd(), relativePath);
      
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (err) {
          console.error(`Error deleting file: ${fullPath}`, err);
        }
      }
    });
  }

  /**
   * Create a new project.
   */
  async createProject(projectData) {
    const project = new Project(projectData);
    await project.save();
    return project;
  }

  /**
   * Get all projects.
   */
  async getAllProjects(filters = {}) {
    return await Project.find(filters).sort({ createdAt: -1 });
  }

  /**
   * Get project by ID.
   */
  async getProjectById(id) {
    const project = await Project.findById(id);
    if (!project) throw new Error('Project not found');
    return project;
  }

  /**
   * Update a project.
   */
  async updateProject(id, updateData) {
    const project = await Project.findByIdAndUpdate(id, updateData, { new: true });
    if (!project) throw new Error('Project not found');
    return project;
  }

  /**
   * Delete a project and its associated files.
   */
  async deleteProject(id) {
    const project = await Project.findById(id);
    if (!project) throw new Error('Project not found');

    // Delete associated files from filesystem first
    await this.deleteProjectFiles(project);

    // Then delete project from DB
    await Project.findByIdAndDelete(id);
    return project;
  }
}

module.exports = new ProjectService();
