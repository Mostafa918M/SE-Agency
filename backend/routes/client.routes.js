const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const upload = require('../utils/uploadUtils');

router.get('/', clientController.getAll);

router.post(
  '/',
  authenticate,
  authorize('admin', 'superadmin'),
  upload.single('logo'),
  clientController.create
);

router.patch(
  '/:id',
  authenticate,
  authorize('admin', 'superadmin'),
  upload.single('logo'),
  clientController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'superadmin'),
  clientController.delete
);

module.exports = router;

