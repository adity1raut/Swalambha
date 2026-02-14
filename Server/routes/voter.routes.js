import express from 'express';
import { voterLogin, getVoterProfile, voterLogout, registerVoter } from '../controller/Voter/voter.login.js';
import authenticateToken, { isVoter } from '../Auth/Auth.js';

const router = express.Router();

router.post('/login', voterLogin); // Public route
router.post('/register', registerVoter); // Public route
router.get('/profile', authenticateToken, isVoter, getVoterProfile); // Protected - Voter only
router.post('/logout', authenticateToken, voterLogout); // Protected

export default router;