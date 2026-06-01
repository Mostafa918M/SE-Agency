const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const projectValidator = require('../validators/project.validator');
const { authenticate, authorize } = require('../middlewares/auth');
const upload = require('../utils/uploadUtils');

/**
 * Public routes.
 */
router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);

/**
 * Admin and Superadmin-only routes.
 */
router.post(
  '/',
  authenticate,
  authorize('admin', 'superadmin'),
  upload.fields([
    { name: 'bannerImg', maxCount: 1 },
    { name: 'img', maxCount: 1 },
    { name: 'gallery', maxCount: 20 },
    { name: 'videoThumb', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  projectValidator.create,
  projectController.create
);

router.patch(
  '/:id',
  authenticate,
  authorize('admin', 'superadmin'),
  upload.fields([
    { name: 'bannerImg', maxCount: 1 },
    { name: 'img', maxCount: 1 },
    { name: 'gallery', maxCount: 20 },
    { name: 'videoThumb', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  projectValidator.update,
  projectController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'superadmin'),
  projectController.delete
);

module.exports = router;
