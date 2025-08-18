// Routes/adminRoutes.js
import express from 'express';
import {
  getAllUsersController,
  createUserController,
  updateUserController,
  deleteUserController,
  executeQueryController,
  generatePasswordController
} from '../Controllers/adminController.js';

const router = express.Router();

// User management routes
router.get('/users', getAllUsersController);
router.post('/users', createUserController);
router.put('/users/:userId', updateUserController);
router.delete('/users/:userId', deleteUserController);

router.post('/generate-password', generatePasswordController);

// Database query route
router.post('/query', executeQueryController);

export default router;