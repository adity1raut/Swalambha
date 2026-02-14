import bcrypt from 'bcryptjs';
import Voter from '../../models/Voter.model.js';
import { sendOTPEmail } from '../../services/emailService.js';

// Store OTPs temporarily (in production, use Redis or session store)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const voter = await Voter.findOne({ email });

    if (!voter) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    if (!voter.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP in session/memory with 10 minute expiry
    otpStore.set(email, {
      otp,
      expiry: Date.now() + 600000, // 10 minutes
      attempts: 0
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(voter.email, voter.name, otp);

    if (!emailResult.success) {
      otpStore.delete(email);
      return res.status(500).json({ message: 'Error sending OTP email' });
    }

    res.status(200).json({
      message: 'OTP sent to your email',
      email: email
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const otpData = otpStore.get(email);

    if (!otpData) {
      return res.status(400).json({ message: 'OTP expired or not found. Please request a new one' });
    }

    // Check expiry
    if (Date.now() > otpData.expiry) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP expired. Please request a new one' });
    }

    // Check attempts (max 3)
    if (otpData.attempts >= 3) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'Too many failed attempts. Please request a new OTP' });
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      otpData.attempts++;
      return res.status(400).json({ 
        message: 'Invalid OTP',
        attemptsLeft: 3 - otpData.attempts
      });
    }

    // OTP verified successfully
    res.status(200).json({ 
      message: 'OTP verified successfully',
      verified: true
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    if (!email || !otp || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const otpData = otpStore.get(email);

    if (!otpData) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one' });
    }

    if (Date.now() > otpData.expiry) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP expired. Please request a new one' });
    }

    if (otpData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Find voter
    const voter = await Voter.findOne({ email }).select('+password');

    if (!voter) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    voter.password = hashedPassword;
    await voter.save();

    // Clear OTP from store
    otpStore.delete(email);

    res.status(200).json({ message: 'Password reset successful. You can now login with your new password' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Clean up expired OTPs every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (now > data.expiry) {
      otpStore.delete(email);
    }
  }
}, 900000);
