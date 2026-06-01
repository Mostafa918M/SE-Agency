const { body, validationResult } = require('express-validator');

/**
 * Validator for authentication-related endpoints.
 * Handles validation and sends errors if they occur.
 */
class AuthValidator {
  /**
   * Run validation rules and send errors if they exist.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Express next function.
   */
  validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }

  /**
   * Rules for sign-in validation.
   * @returns {Array} - Array of validation rules.
   */
  signInRules() {
    return [
      body('identifier').notEmpty().withMessage('Username, email, or phone number is required'),
      body('password').notEmpty().withMessage('Password is required'),
    ];
  }

  /**
   * Rules for user creation validation (Superadmin only).
   * @returns {Array} - Array of validation rules.
   */
  createUserRules() {
    return [
      body('username').notEmpty().withMessage('Username is required'),
      body('email').isEmail().withMessage('Email address is invalid'),
      body('phoneNumber').notEmpty().withMessage('Phone number is required'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
      body('role').optional().isIn(['user', 'admin', 'superadmin']).withMessage('Invalid role'),
    ];
  }
}

const authValidator = new AuthValidator();
module.exports = {
  signIn: [...authValidator.signInRules(), authValidator.validate],
  createUser: [...authValidator.createUserRules(), authValidator.validate],
};
