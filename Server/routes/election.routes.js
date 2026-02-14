import express from 'express';
import multer from 'multer';
import {
  createElection,
  getAllElections,
  getElectionById,
  updateElectionStatus,
  deleteElection,
  uploadVoterCSV
} from '../controller/Admin/election.controller.js';
import authenticateToken from '../Auth/Auth.js';

const router = express.Router();

// Multer config — store CSV in memory buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

router.post('/create', authenticateToken, createElection);
router.get('/all', authenticateToken, getAllElections);
router.get('/:id', authenticateToken, getElectionById);
router.patch('/:id/status', authenticateToken, updateElectionStatus);
router.delete('/:id', authenticateToken, deleteElection);
router.post('/:id/upload-voters', authenticateToken, upload.single('voterFile'), uploadVoterCSV);

export default router;