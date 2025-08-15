import express from 'express';
import { requestPasswordReset, resetPassword } from '../../controllers/passwordController.js';

const router = express.Router();

// Endpoint to request a password reset link
router.post('/request-password-reset', requestPasswordReset);

// Endpoint to actually reset the password
router.post('/reset-password', resetPassword);

export default router;
