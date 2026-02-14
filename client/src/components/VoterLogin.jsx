import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function VoterLogin() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    voterId: '',
    electionId: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, user, userType } = useAuth();
  const { theme, toggleTheme, colors } = useTheme();

  useEffect(() => {
    // Redirect if already logged in
    if (user && userType === 'voter') {
      navigate('/voter/dashboard', { replace: true });
    }
  }, [user, userType, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isRegisterMode ? '/register' : '/login';
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/voter${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(isRegisterMode ? formData : {
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegisterMode) {
          setSuccess('Registration successful! You can now login.');
          setFormData({ name: '', email: '', password: '', voterId: '', electionId: '' });
          setTimeout(() => {
            setIsRegisterMode(false);
            setSuccess('');
          }, 2000);
        } else {
          login(data.token, data.voter, 'voter');
          navigate('/voter/dashboard');
        }
      } else {
        setError(data.message || `${isRegisterMode ? 'Registration' : 'Login'} failed`);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setFormData({ name: '', email: '', password: '', voterId: '', electionId: '' });
    setError('');
    setSuccess('');
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

      {/* Back to Home */}
      <button
        onClick={() => navigate('/')}
        style={{
          ...styles.homeButton,
          background: colors.surfaceGlass,
          color: colors.text,
          border: `2px solid ${colors.border}`,
        }}
      >
        ← Home
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
            🗳️
          </div>
          <h2 style={{
            ...styles.title,
            color: colors.text,
          }}>
            {isRegisterMode ? 'Voter Registration' : 'Voter Login'}
          </h2>
          <p style={{
            ...styles.subtitle,
            color: colors.textSecondary,
          }}>
            {isRegisterMode ? 'Create your voter account' : 'Sign in to vote'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegisterMode && (
            <div style={styles.inputGroup}>
              <label htmlFor="name" style={{
                ...styles.label,
                color: colors.text,
              }}>Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  ...styles.input,
                  background: colors.cardBg,
                  color: colors.text,
                  border: `2px solid ${colors.border}`,
                }}
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label htmlFor="email" style={{
              ...styles.label,
              color: colors.text,
            }}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                ...styles.input,
                background: colors.cardBg,
                color: colors.text,
                border: `2px solid ${colors.border}`,
              }}
              placeholder="Enter your email"
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={{
              ...styles.label,
              color: colors.text,
            }}>Password</label>
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
              placeholder="Enter your password"
            />
          </div>

          {isRegisterMode && (
            <>
              <div style={styles.inputGroup}>
                <label htmlFor="voterId" style={{
                  ...styles.label,
                  color: colors.text,
                }}>Voter ID</label>
                <input
                  type="text"
                  id="voterId"
                  name="voterId"
                  value={formData.voterId}
                  onChange={handleChange}
                  required
                  style={{
                    ...styles.input,
                    background: colors.cardBg,
                    color: colors.text,
                    border: `2px solid ${colors.border}`,
                  }}
                  placeholder="Enter your voter ID"
                />
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="electionId" style={{
                  ...styles.label,
                  color: colors.text,
                }}>Election ID</label>
                <input
                  type="text"
                  id="electionId"
                  name="electionId"
                  value={formData.electionId}
                  onChange={handleChange}
                  required
                  style={{
                    ...styles.input,
                    background: colors.cardBg,
                    color: colors.text,
                    border: `2px solid ${colors.border}`,
                  }}
                  placeholder="Enter election ID"
                />
              </div>
            </>
          )}

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
            {loading ? (isRegisterMode ? 'Registering...' : 'Logging in...') : (isRegisterMode ? 'Register' : 'Login')}
          </button>

          <Link to="/login" style={{
            ...styles.adminLink,
            color: theme === 'dark' ? colors.accent : colors.primary,
          }}>
            Login as Admin →
          </Link>
        </form>
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
    marginBottom: '40px',
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
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
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
  toggleButton: {
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  },
  adminLink: {
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

// Responsive styles
const mediaQuery = window.matchMedia('(max-width: 768px)');
if (mediaQuery.matches) {
  styles.formWrapper.padding = '40px 30px';
  styles.logo.fontSize = '3.5rem';
  styles.logo.width = '80px';
  styles.logo.height = '80px';
  styles.title.fontSize = '24px';
}

export default VoterLogin;
