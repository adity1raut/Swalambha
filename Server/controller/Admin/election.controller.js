import Election from '../../models/Election.model.js';
import Voter from '../../models/Voter.model.js';
import bcrypt from 'bcryptjs';
import { sendVoterCredentials } from '../../services/emailService.js';
import crypto from 'crypto';
import csvParser from 'csv-parser';
import { Readable } from 'stream';

// Generate random password (10 characters)
const generatePassword = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    password += chars[bytes[i] % chars.length];
  }
  return password;
};

// Generate unique voter ID
const generateVoterId = () => {
  return `VOTER${Date.now()}${Math.floor(Math.random() * 1000)}`;
};

// Create Election with Voters
export const createElection = async (req, res) => {
  try {
    const { title, description, voters } = req.body;
    const adminId = req.user.id;

    // Validation
    if (!title) {
      return res.status(400).json({ 
        message: 'Title is required' 
      });
    }

    if (!voters || voters.length === 0) {
      return res.status(400).json({ 
        message: 'At least one voter is required' 
      });
    }

    // Create election with default dates (can be updated later)
    const election = new Election({
      title,
      description: description || '',
      startDate: new Date(), // Default to now
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
      status: 'DRAFT',
      totalVoters: voters.length,
      createdBy: adminId
    });

    await election.save();

    // Process voters
    const voterResults = [];
    const emailPromises = [];

    for (const voterData of voters) {
      try {
        const { name, email } = voterData;

        if (!name || !email) {
          voterResults.push({
            email: email || 'unknown',
            success: false,
            message: 'Name and email are required'
          });
          continue;
        }

        // Check if voter already exists
        const existingVoter = await Voter.findOne({ email, election: election._id });
        if (existingVoter) {
          voterResults.push({
            email,
            success: false,
            message: 'Voter already exists for this election'
          });
          continue;
        }

        // Generate credentials
        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 10);
        const voterId = generateVoterId();

        // Create voter
        const voter = new Voter({
          name,
          email,
          password: hashedPassword,
          voterId,
          election: election._id
        });

        await voter.save();

        // Send email (non-blocking)
        const emailPromise = sendVoterCredentials(email, name, password, title)
          .then(result => ({
            email,
            success: result.success,
            message: result.success ? 'Credentials sent successfully' : 'Failed to send email'
          }))
          .catch(() => ({
            email,
            success: false,
            message: 'Email sending failed'
          }));

        emailPromises.push(emailPromise);

        voterResults.push({
          email,
          name,
          voterId,
          success: true,
          message: 'Voter created successfully'
        });

      } catch (error) {
        voterResults.push({
          email: voterData.email,
          success: false,
          message: error.message
        });
      }
    }

    // Wait for all emails to be sent
    const emailResults = await Promise.all(emailPromises);

    res.status(201).json({
      message: 'Election created successfully',
      election: {
        id: election._id,
        title: election.title,
        description: election.description,
        status: election.status,
        totalVoters: election.totalVoters
      },
      voterResults,
      emailResults
    });

  } catch (error) {
    console.error('Election creation error:', error);
    res.status(500).json({ 
      message: 'Server error during election creation',
      error: error.message 
    });
  }
};

// Get all elections
export const getAllElections = async (req, res) => {
  try {
    const elections = await Election.find()
      .populate('createdBy', 'email role')
      .sort({ createdAt: -1 });

    res.status(200).json({ elections });
  } catch (error) {
    console.error('Fetch elections error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single election
export const getElectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const election = await Election.findById(id)
      .populate('createdBy', 'email role');

    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    const voters = await Voter.find({ election: id }).select('-password');

    res.status(200).json({ election, voters });
  } catch (error) {
    console.error('Fetch election error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update election status
export const updateElectionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const election = await Election.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    res.status(200).json({ 
      message: 'Election status updated',
      election 
    });
  } catch (error) {
    console.error('Update election error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete election
export const deleteElection = async (req, res) => {
  try {
    const { id } = req.params;

    const election = await Election.findByIdAndDelete(id);

    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Delete associated voters
    await Voter.deleteMany({ election: id });

    res.status(200).json({ message: 'Election deleted successfully' });
  } catch (error) {
    console.error('Delete election error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Parse CSV buffer into array of { name, email } objects
const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(buffer);

    stream
      .pipe(csvParser())
      .on('data', (row) => {
        const name = row.name || row.Name || row.NAME;
        const email = row.email || row.Email || row.EMAIL;
        if (name && email) {
          results.push({ name: name.trim(), email: email.trim().toLowerCase() });
        }
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

// Upload CSV file to add voters to an existing election
export const uploadVoterCSV = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ message: 'CSV file is required' });
    }

    if (!req.file.originalname.endsWith('.csv')) {
      return res.status(400).json({ message: 'Only CSV files are allowed' });
    }

    // Validate election exists
    const election = await Election.findById(id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Parse CSV — extract only name and email
    const voters = await parseCSV(req.file.buffer);

    if (voters.length === 0) {
      return res.status(400).json({
        message: 'No valid voters found in CSV. Ensure columns "name" and "email" exist.'
      });
    }

    const voterResults = [];
    const emailPromises = [];

    for (const voterData of voters) {
      try {
        const { name, email } = voterData;

        // Check if voter already exists for this election
        const existingVoter = await Voter.findOne({ email, election: id });
        if (existingVoter) {
          voterResults.push({
            email,
            success: false,
            message: 'Voter already exists for this election'
          });
          continue;
        }

        // Generate credentials
        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 10);
        const voterId = generateVoterId();

        // Create voter
        const voter = new Voter({
          name,
          email,
          password: hashedPassword,
          voterId,
          election: id
        });

        await voter.save();

        // Send email with credentials (non-blocking)
        const emailPromise = sendVoterCredentials(email, name, password, election.title)
          .then(result => ({
            email,
            success: result.success,
            message: result.success ? 'Credentials sent successfully' : 'Failed to send email'
          }))
          .catch(() => ({
            email,
            success: false,
            message: 'Email sending failed'
          }));

        emailPromises.push(emailPromise);

        voterResults.push({
          email,
          name,
          voterId,
          success: true,
          message: 'Voter created successfully'
        });

      } catch (error) {
        voterResults.push({
          email: voterData.email,
          success: false,
          message: error.message
        });
      }
    }

    // Update total voter count on election
    const totalVoters = await Voter.countDocuments({ election: id });
    await Election.findByIdAndUpdate(id, { totalVoters });

    // Wait for all emails
    const emailResults = await Promise.all(emailPromises);

    const successCount = voterResults.filter(v => v.success).length;

    res.status(201).json({
      message: `${successCount} voters added successfully from CSV`,
      totalVotersInElection: totalVoters,
      voterResults,
      emailResults
    });

  } catch (error) {
    console.error('CSV upload error:', error);
    res.status(500).json({
      message: 'Server error during CSV upload',
      error: error.message
    });
  }
};