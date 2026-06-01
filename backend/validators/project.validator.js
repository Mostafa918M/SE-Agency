const { body, validationResult } = require('express-validator');

/**
 * Validator for project-related endpoints.
 */
class ProjectValidator {
  /**
   * Run validation rules and send errors if they exist.
   */
  validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }

  /**
   * Rules for creating or updating a project.
   */
  projectRules() {
    return [
      body('title').notEmpty().withMessage('Title is required'),
      body('client').notEmpty().withMessage('Client name is required'),
      
      // Image/Banner fields are handled by files OR body
      body('bannerImg').custom((value, { req }) => {
        if (!req.files?.bannerImg && !value) {
          throw new Error('Banner image is required');
        }
        return true;
      }),
      body('img').custom((value, { req }) => {
        if (!req.files?.img && !value) {
          throw new Error('Thumbnail image is required');
        }
        return true;
      }),
      
      body('cat').notEmpty().withMessage('Category is required'),
      body('mainHeadingStart').notEmpty().withMessage('Main heading starting part is required'),
      body('mainHeadingMute').notEmpty().withMessage('Main heading muted part is required'),
      body('mainHeadingEnd').notEmpty().withMessage('Main heading ending part is required'),
      body('description').notEmpty().withMessage('Description is required'),
      
      // Categories validation: Handle both string (from multipart) and array (from json)
      body('categories').custom((value) => {
        if (!value) throw new Error('At least one category is required');
        
        let categories = value;
        if (typeof value === 'string') {
          try {
            categories = JSON.parse(value);
          } catch (e) {
            throw new Error('Categories must be a valid JSON array');
          }
        }
        
        if (!Array.isArray(categories) || categories.length === 0) {
          throw new Error('Categories must be a non-empty array');
        }
        
        categories.forEach(cat => {
          if (!cat.name) throw new Error('Each category must have a name');
          if (cat.tags && !Array.isArray(cat.tags)) throw new Error('Category tags must be an array');
        });
        
        return true;
      }),
      
      body('gallery').optional().custom((value, { req }) => {
        if (!req.files?.gallery && value && !Array.isArray(value)) {
          throw new Error('Gallery should be an array of image URLs');
        }
        return true;
      }),
    ];
  }
}

const projectValidator = new ProjectValidator();
module.exports = {
  create: [...projectValidator.projectRules(), projectValidator.validate],
  update: [...projectValidator.projectRules().map(rule => rule.optional()), projectValidator.validate],
};
