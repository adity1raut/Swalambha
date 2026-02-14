import express from 'express';
import { adminLogin, getAdminProfile, adminLogout, createAdmin } from '../controller/Admin/admin.login.js';
import authenticateToken from '../Auth/Auth.js';

const router = express.Router();

router.post('/login', adminLogin); // Public route
router.get('/profile', authenticateToken, getAdminProfile); // Protected
router.post('/logout', authenticateToken, adminLogout); // Protected
router.post('/create', createAdmin); // Public route

export default router;