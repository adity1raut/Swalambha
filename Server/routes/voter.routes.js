import express from 'express';
import { voterLogin, getVoterProfile, voterLogout, registerVoter } from '../controller/Voter/voter.login.js';
import { forgotPassword, verifyOTP, resetPassword } from '../controller/Voter/voter.forgetpass.js';
import authenticateToken, { isVoter } from '../Auth/Auth.js';

const router = express.Router();

router.post('/login', voterLogin); // Public route
router.post('/register', registerVoter); // Public route
router.post('/forgot-password', forgotPassword); // Public route
router.post('/verify-otp', verifyOTP); // Verify OTP
router.post('/reset-password', resetPassword); // Reset password with OTP
router.get('/profile', authenticateToken, isVoter, getVoterProfile); // Protected - Voter only
router.post('/logout', authenticateToken, voterLogout); // Protected

export default router;