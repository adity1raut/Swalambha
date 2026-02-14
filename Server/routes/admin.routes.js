import express from 'express';
import { adminLogin, getAdminProfile, adminLogout, createAdmin } from '../controller/Admin/admin.login.js';
import authenticateToken, { isAdmin } from '../Auth/Auth.js';

const router = express.Router();

router.post('/login', adminLogin); // Public route
router.get('/profile', authenticateToken, isAdmin, getAdminProfile); // Protected - Admin only
router.post('/logout', authenticateToken, adminLogout); // Protected
router.post('/create', authenticateToken, isAdmin, createAdmin); // Protected - Admin only

export default router;