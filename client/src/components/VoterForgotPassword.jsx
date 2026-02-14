import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function VoterForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  
  const navigate = useNavigate();
  const { theme, toggleTheme, colors } = useTheme();

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/voter/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('OTP sent to your email! Please check your inbox.');
        setTimeout(() => {
          setStep(2);
          setSuccess('');
        }, 2000);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/voter/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok && data.verified) {
        setSuccess('OTP verified! Please enter your new password.');
        setTimeout(() => {
          setStep(3);
          setSuccess('');
        }, 1500);
      } else {
        setError(data.message || 'Invalid OTP');
        if (data.attemptsLeft !== undefined) {
          setAttemptsLeft(data.attemptsLeft);
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/voter/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/voter/login');
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleResendOTP = async () => {
    setOtp('');
    setAttemptsLeft(3);
    await handleSendOTP({ preventDefault: () => {} });
  };

  return (
    <div style={{
      ...styles.container,
      background: colors.gradient,
    }}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        style={{
          ...styles.themeToggle,
          background: colors.surfaceGlass,
          color: colors.text,
          border: `2px solid ${colors.border}`,
        }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* Back Button */}
      <button
        onClick={() => navigate('/voter/login')}
        style={{
          ...styles.homeButton,
          background: colors.surfaceGlass,
          color: colors.text,
          border: `2px solid ${colors.border}`,
        }}
      >
        ← Back to Login
      </button>

      <div style={{
        ...styles.formWrapper,
        background: colors.surfaceGlass,
        border: `1px solid ${colors.border}`,
        backdropFilter: 'blur(20px)',
      }}>
        <div style={styles.logoSection}>
          <div style={{
            ...styles.logo,
            background: theme === 'dark'
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #10b981, #059669)',
          }}>
            {step === 1 && '🔐'}
            {step === 2 && '🔢'}
            {step === 3 && '🔑'}
          </div>
          <h2 style={{
            ...styles.title,
            color: colors.text,
          }}>
            {step === 1 && 'Forgot Password?'}
            {step === 2 && 'Verify OTP'}
            {step === 3 && 'Reset Password'}
          </h2>
          <p style={{
            ...styles.subtitle,
            color: colors.textSecondary,
          }}>
            {step === 1 && 'Enter your email to receive an OTP'}
            {step === 2 && 'Enter the OTP sent to your email'}
            {step === 3 && 'Enter your new password'}
          </p>
        </div>

        {/* Step Progress Indicator */}
        <div style={styles.progressContainer}>
          <div style={{
            ...styles.progressStep,
            background: step >= 1 ? colors.primary : colors.border,
            color: step >= 1 ? 'white' : colors.textSecondary,
          }}>1</div>
          <div style={{
            ...styles.progressLine,
            background: step >= 2 ? colors.primary : colors.border,
          }} />
          <div style={{
            ...styles.progressStep,
            background: step >= 2 ? colors.primary : colors.border,
            color: step >= 2 ? 'white' : colors.textSecondary,
          }}>2</div>
          <div style={{
            ...styles.progressLine,
            background: step >= 3 ? colors.primary : colors.border,
          }} />
          <div style={{
            ...styles.progressStep,
            background: step >= 3 ? colors.primary : colors.border,
            color: step >= 3 ? 'white' : colors.textSecondary,
          }}>3</div>
        </div>
        
        {/* Step 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={{
                ...styles.label,
                color: colors.text,
              }}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                  setSuccess('');
                }}
                required
                style={{
                  ...styles.input,
                  background: colors.cardBg,
                  color: colors.text,
                  border: `2px solid ${colors.border}`,
                }}
                placeholder="Enter your registered email"
              />
            </div>

            {error && <div style={{
              ...styles.error,
              background: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.08)',
              color: colors.error,
              border: `1px solid ${theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
            }}>{error}</div>}
            
            {success && <div style={{
              ...styles.success,
              background: theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)',
              color: colors.success,
              border: `1px solid ${theme === 'dark' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
            }}>{success}</div>}

            <button 
              type="submit" 
              disabled={loading}
              style={{
                ...styles.button,
                background: loading 
                  ? '#6c757d'
                  : theme === 'dark'
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'linear-gradient(135deg, #10b981, #059669)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>

            <Link to="/voter/login" style={{
              ...styles.backLink,
              color: theme === 'dark' ? colors.accent : colors.primary,
            }}>
              ← Back to Login
            </Link>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="otp" style={{
                ...styles.label,
                color: colors.text,
              }}>Enter OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError('');
                  setSuccess('');
                }}
                required
                maxLength="6"
                style={{
                  ...styles.input,
                  background: colors.cardBg,
                  color: colors.text,
                  border: `2px solid ${colors.border}`,
                  textAlign: 'center',
                  fontSize: '24px',
                  letterSpacing: '8px',
                  fontFamily: 'monospace',
                }}
                placeholder="000000"
              />
              <p style={{
                fontSize: '12px',
                color: colors.textSecondary,
                margin: '5px 0 0 0',
                textAlign: 'center',
              }}>
                Attempts remaining: {attemptsLeft}
              </p>
            </div>

            {error && <div style={{
              ...styles.error,
              background: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.08)',
              color: colors.error,
              border: `1px solid ${theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
            }}>{error}</div>}
            
            {success && <div style={{
              ...styles.success,
              background: theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)',
              color: colors.success,
              border: `1px solid ${theme === 'dark' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
            }}>{success}</div>}

            <button 
              type="submit" 
              disabled={loading}
              style={{
                ...styles.button,
                background: loading 
                  ? '#6c757d'
                  : theme === 'dark'
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'linear-gradient(135deg, #10b981, #059669)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
              style={{
                ...styles.resendButton,
                color: theme === 'dark' ? colors.accent : colors.primary,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              Resend OTP
            </button>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={{
                ...styles.label,
                color: colors.text,
              }}>New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  background: colors.cardBg,
                  color: colors.text,
                  border: `2px solid ${colors.border}`,
                }}
                placeholder="Enter new password"
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="confirmPassword" style={{
                ...styles.label,
                color: colors.text,
              }}>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  background: colors.cardBg,
                  color: colors.text,
                  border: `2px solid ${colors.border}`,
                }}
                placeholder="Confirm new password"
              />
            </div>

            {error && <div style={{
              ...styles.error,
              background: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.08)',
              color: colors.error,
              border: `1px solid ${theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
            }}>{error}</div>}
            
            {success && <div style={{
              ...styles.success,
              background: theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)',
              color: colors.success,
              border: `1px solid ${theme === 'dark' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
            }}>{success}</div>}

            <button 
              type="submit" 
              disabled={loading}
              style={{
                ...styles.button,
                background: loading 
                  ? '#6c757d'
                  : theme === 'dark'
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'linear-gradient(135deg, #10b981, #059669)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
    padding: '20px',
  },
  themeToggle: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '25px',
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: 100,
    backdropFilter: 'blur(10px)',
  },
  homeButton: {
    position: 'fixed',
    top: '20px',
    left: '20px',
    padding: '12px 20px',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: 100,
    backdropFilter: 'blur(10px)',
  },
  formWrapper: {
    padding: '50px 40px',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  logo: {
    fontSize: '4rem',
    margin: '0 auto 20px',
    width: '100px',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
  title: {
    textAlign: 'center',
    marginBottom: '10px',
    fontSize: '28px',
    fontWeight: '800',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: '14px',
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '30px',
    gap: '10px',
  },
  progressStep: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'all 0.3s ease',
  },
  progressLine: {
    width: '60px',
    height: '3px',
    transition: 'all 0.3s ease',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
  },
  input: {
    padding: '15px',
    fontSize: '15px',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  button: {
    padding: '16px',
    fontSize: '16px',
    fontWeight: '700',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    marginTop: '10px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
  resendButton: {
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'underline',
    transition: 'all 0.3s ease',
  },
  backLink: {
    textAlign: 'center',
    fontSize: '15px',
    textDecoration: 'none',
    fontWeight: '600',
    marginTop: '10px',
    transition: 'all 0.3s ease',
  },
  error: {
    padding: '12px',
    borderRadius: '10px',
    fontSize: '14px',
    textAlign: 'center',
  },
  success: {
    padding: '12px',
    borderRadius: '10px',
    fontSize: '14px',
    textAlign: 'center',
  }
};

export default VoterForgotPassword;