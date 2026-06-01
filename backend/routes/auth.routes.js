const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authValidator = require('../validators/auth.validator');
const { authenticate, authorize } = require('../middlewares/auth');

/**
 * Public routes for authentication.
 */
router.post('/signin', authValidator.signIn, authController.signIn);
router.post('/refresh-token', authController.refreshToken);

/**
 * Protected routes.
 */
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

/**
 * Superadmin-only routes.
 * Used to create new user accounts.
 */
router.post('/create-account', authenticate, authorize('superadmin'), authValidator.createUser, authController.createAccount);

module.exports = router;
