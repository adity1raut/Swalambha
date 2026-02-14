import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Voter from '../../models/Voter.model.js';

export const voterLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const voter = await Voter.findOne({ email }).select('+password').populate('election');

    if (!voter) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!voter.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    const isPasswordValid = await bcrypt.compare(password, voter.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: voter._id, 
        email: voter.email, 
        voterId: voter.voterId,
        role: 'voter'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie with token
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      voter: {
        id: voter._id,
        name: voter.name,
        email: voter.email,
        voterId: voter.voterId,
        hasVoted: voter.hasVoted,
        election: voter.election
      }
    });

  } catch (error) {
    console.error('Voter login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getVoterProfile = async (req, res) => {
  try {
    const voter = await Voter.findById(req.user.id).populate('election');
    
    if (!voter) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    res.status(200).json({
      voter: {
        id: voter._id,
        name: voter.name,
        email: voter.email,
        voterId: voter.voterId,
        hasVoted: voter.hasVoted,
        isActive: voter.isActive,
        election: voter.election
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const voterLogout = (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  res.status(200).json({ message: 'Logout successful' });
};

export const registerVoter = async (req, res) => {
  try {
    const { name, email, password, voterId, electionId } = req.body;

    if (!name || !email || !password || !voterId || !electionId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if voter already exists
    const existingVoter = await Voter.findOne({ $or: [{ email }, { voterId }] });
    if (existingVoter) {
      return res.status(409).json({ message: 'Voter with this email or voter ID already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new voter
    const newVoter = new Voter({
      name,
      email,
      password: hashedPassword,
      voterId,
      election: electionId,
      hasVoted: false,
      isActive: true
    });

    await newVoter.save();

    res.status(201).json({
      message: 'Voter registered successfully',
      voter: {
        id: newVoter._id,
        name: newVoter.name,
        email: newVoter.email,
        voterId: newVoter.voterId,
        hasVoted: newVoter.hasVoted
      }
    });

  } catch (error) {
    console.error('Voter registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};